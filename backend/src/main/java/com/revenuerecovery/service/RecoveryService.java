package com.revenuerecovery.service;

import com.revenuerecovery.dto.RecoveryCaseResponse;
import com.revenuerecovery.dto.RecoveryRequest;
import com.revenuerecovery.dto.RecoveryResponse;
import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.entity.RecoveryAttempt;
import com.revenuerecovery.repository.PaymentRepository;
import com.revenuerecovery.repository.RecoveryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecoveryService {

    private final PaymentRepository paymentRepository;
    private final RecoveryRepository recoveryRepository;
    private final AIService aiService;
    private final RazorpayService razorpayService;
    private final AuditLogService auditLogService;

    public RecoveryService(
            PaymentRepository paymentRepository,
            RecoveryRepository recoveryRepository,
            AIService aiService,
            RazorpayService razorpayService,
            AuditLogService auditLogService) {

        this.paymentRepository = paymentRepository;
        this.recoveryRepository = recoveryRepository;
        this.aiService = aiService;
        this.razorpayService = razorpayService;
        this.auditLogService = auditLogService;
    }

    public RecoveryResponse processRecovery(
            RecoveryRequest request) {

        Payment payment = paymentRepository
                .findById(request.getPaymentId())
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        long retryCount = recoveryRepository.countRetryAttempts(payment);

        String action = aiService.decideRecoveryAction(payment, retryCount);

        String status;
        java.math.BigDecimal recoveredAmount = java.math.BigDecimal.ZERO;

        if ("RETRY_PAYMENT".equals(action)) {

            boolean retrySuccessful = razorpayService.retryPayment(payment);

            if (retrySuccessful) {
                status = "RECOVERED";
                recoveredAmount = payment.getAmount();
                payment.setStatus("SUCCESS");
                paymentRepository.save(payment);
            } else {
                status = "RETRY_FAILED";
            }

        } else if ("SEND_PAYMENT_LINK".equals(action)) {

            status = "LINK_SENT_RECOVERED";
            recoveredAmount = payment.getAmount();
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);

        } else if ("ESCALATE_TO_HUMAN".equals(action)) {

            status = "ESCALATED_HUMAN";

        } else if ("EVALUATE".equals(action)) {

            status = "PENDING";

        } else if ("NO_ACTION".equals(action)) {

            status = "NO_ACTION";

        } else {

            action = "EVALUATE";
            status = "PENDING";
        }

        RecoveryAttempt attempt = new RecoveryAttempt(
                payment,
                action,
                status,
                recoveredAmount,
                LocalDateTime.now()
        );

        recoveryRepository.save(attempt);

        auditLogService.log(
                payment.getId(),
                action,
                status
        );

        return new RecoveryResponse(
                payment.getId(),
                status,
                action
        );
    }

    public List<RecoveryResponse> processBatchRecovery() {
        List<Payment> pendingPayments = paymentRepository.findAll()
                .stream()
                .filter(p -> !"SUCCESS".equalsIgnoreCase(p.getStatus()) && !"CAPTURED".equalsIgnoreCase(p.getStatus()))
                .collect(Collectors.toList());

        return pendingPayments.stream()
                .map(payment -> processRecovery(new RecoveryRequest(payment.getId())))
                .collect(Collectors.toList());
    }

    public List<RecoveryCaseResponse> getRecoveryCases() {

        return recoveryRepository
                .findAllWithPaymentOrderByAttemptedAtDesc()
                .stream()
                .map(attempt -> new RecoveryCaseResponse(
                        attempt.getId(),
                        attempt.getPayment().getId(),
                        attempt.getPayment().getAmount(),
                        attempt.getPayment().getStatus(),
                        attempt.getAction(),
                        attempt.getStatus(),
                        attempt.getRecoveredAmount(),
                        attempt.getPayment().getFailureReason(),
                        attempt.getAttemptedAt()
                ))
                .collect(Collectors.toList());
    }
}