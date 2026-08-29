package com.revenuerecovery.controller;

import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.repository.PaymentRepository;
import com.revenuerecovery.repository.RecoveryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final PaymentRepository paymentRepository;
    private final RecoveryRepository recoveryRepository;

    public DashboardController(
            PaymentRepository paymentRepository,
            RecoveryRepository recoveryRepository) {

        this.paymentRepository = paymentRepository;
        this.recoveryRepository = recoveryRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard() {

        long totalPayments = paymentRepository.count();

        long totalRecoveryAttempts = recoveryRepository.count();

        java.math.BigDecimal totalRevenueAtRisk = paymentRepository.sumTotalRevenueAtRisk();
        java.math.BigDecimal totalRevenueRecovered = recoveryRepository.sumTotalRevenueRecovered();

        double recoveryRatePercentage = 0.0;
        if (totalRevenueAtRisk.doubleValue() > 0) {
            recoveryRatePercentage = Math.min(100.0, (totalRevenueRecovered.doubleValue() / (totalRevenueAtRisk.doubleValue() + totalRevenueRecovered.doubleValue())) * 100.0);
        } else if (totalRevenueRecovered.doubleValue() > 0) {
            recoveryRatePercentage = 100.0;
        }

        List<Map<String, Object>> recentRecoveryCases = new ArrayList<>();

        List<Payment> payments = paymentRepository.findAll();

        for (Payment payment : payments) {

            String status = payment.getStatus();

            if ("FAILED".equalsIgnoreCase(status)
                    || "PENDING".equalsIgnoreCase(status)) {

                Map<String, Object> recoveryCase = new HashMap<>();

                recoveryCase.put("paymentId", payment.getId());
                recoveryCase.put("amount", payment.getAmount());
                recoveryCase.put("status", payment.getStatus());
                recoveryCase.put("failureReason", payment.getFailureReason() != null ? payment.getFailureReason() : "UNKNOWN");

                if ("FAILED".equalsIgnoreCase(status)) {

                    recoveryCase.put(
                            "message",
                            "AI engine evaluating bounded recovery action."
                    );

                } else {

                    recoveryCase.put(
                            "message",
                            "Monitoring pending payment."
                    );
                }

                recentRecoveryCases.add(recoveryCase);
            }
        }

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalPayments", totalPayments);
        dashboard.put("totalRecoveryAttempts", totalRecoveryAttempts);
        dashboard.put("totalRevenueAtRisk", totalRevenueAtRisk);
        dashboard.put("totalRevenueRecovered", totalRevenueRecovered);
        dashboard.put("recoveryRatePercentage", Math.round(recoveryRatePercentage * 10.0) / 10.0);
        dashboard.put("recentRecoveryCases", recentRecoveryCases);

        return ResponseEntity.ok(dashboard);
    }
}