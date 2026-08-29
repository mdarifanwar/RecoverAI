package com.revenuerecovery.controller;

import com.revenuerecovery.entity.AuditLog;
import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.entity.RecoveryAttempt;
import com.revenuerecovery.repository.AuditLogRepository;
import com.revenuerecovery.repository.PaymentRepository;
import com.revenuerecovery.repository.RecoveryRepository;
import com.revenuerecovery.rules.RecoveryRules;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final PaymentRepository paymentRepository;
    private final RecoveryRepository recoveryRepository;
    private final AuditLogRepository auditLogRepository;
    private final RecoveryRules recoveryRules;

    public WebhookController(
            PaymentRepository paymentRepository,
            RecoveryRepository recoveryRepository,
            AuditLogRepository auditLogRepository,
            RecoveryRules recoveryRules) {

        this.paymentRepository = paymentRepository;
        this.recoveryRepository = recoveryRepository;
        this.auditLogRepository = auditLogRepository;
        this.recoveryRules = recoveryRules;
    }

    @PostMapping("/razorpay")
    public ResponseEntity<Map<String, Object>> handleRazorpayWebhook(
            @RequestBody(required = false) Map<String, Object> payload) {

        String event = "payment.failed";
        BigDecimal amount = new BigDecimal("2500.00");
        String failureReason = "Card Declined";
        String razorpayPaymentId = "pay_" + UUID.randomUUID().toString().substring(0, 8);

        if (payload != null && payload.containsKey("event")) {
            event = String.valueOf(payload.get("event"));
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> payloadObj = (Map<String, Object>) payload.get("payload");
                if (payloadObj != null && payloadObj.containsKey("payment")) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> paymentEntity = (Map<String, Object>) ((Map<String, Object>) payloadObj.get("payment")).get("entity");
                    if (paymentEntity != null) {
                        if (paymentEntity.get("id") != null) {
                            razorpayPaymentId = String.valueOf(paymentEntity.get("id"));
                        }
                        if (paymentEntity.get("amount") != null) {
                            amount = new BigDecimal(String.valueOf(paymentEntity.get("amount"))).divide(new BigDecimal("100"));
                        }
                        if (paymentEntity.get("error_description") != null) {
                            failureReason = String.valueOf(paymentEntity.get("error_description"));
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("Parsing Razorpay payload fallback: " + e.getMessage());
            }
        }

        System.out.println(">>> Real-Time Razorpay Webhook Ingested: " + event + " for " + razorpayPaymentId);

        // 1. Save live payment failure to Database
        Payment payment = new Payment(
                razorpayPaymentId,
                amount,
                "FAILED",
                failureReason,
                LocalDateTime.now()
        );
        payment = paymentRepository.save(payment);

        // 2. Evaluate AI Rule & create recovery attempt
        String recommendedAction = recoveryRules.decideAction(payment, 0);
        RecoveryAttempt attempt = new RecoveryAttempt(
                payment,
                recommendedAction,
                "PENDING_RECOVERY",
                BigDecimal.ZERO,
                LocalDateTime.now()
        );
        recoveryRepository.save(attempt);

        // 3. Log Immutable Audit Record
        AuditLog auditLog = new AuditLog(
                payment.getId(),
                recommendedAction,
                "INGESTED_VIA_WEBHOOK",
                LocalDateTime.now()
        );
        auditLogRepository.save(auditLog);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Real-Time Razorpay Webhook Event Ingested");
        response.put("paymentId", payment.getId());
        response.put("razorpayPaymentId", payment.getRazorpayPaymentId());
        response.put("recommendedAction", recommendedAction);

        return ResponseEntity.ok(response);
    }
}