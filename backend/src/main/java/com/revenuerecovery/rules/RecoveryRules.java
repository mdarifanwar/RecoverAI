package com.revenuerecovery.rules;

import com.revenuerecovery.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class RecoveryRules {

    public String decideAction(Payment payment) {

        if (payment == null) {
            return "NO_ACTION";
        }

        if ("FAILED".equalsIgnoreCase(payment.getStatus())) {
            return "RETRY_PAYMENT";
        }

        if ("PENDING".equalsIgnoreCase(payment.getStatus())) {
            return "EVALUATE";
        }

        if ("SUCCESS".equalsIgnoreCase(payment.getStatus())
                || "CAPTURED".equalsIgnoreCase(payment.getStatus())) {
            return "NO_ACTION";
        }

        return "EVALUATE";
    }
}