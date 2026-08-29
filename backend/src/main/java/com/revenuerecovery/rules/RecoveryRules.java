package com.revenuerecovery.rules;

import com.revenuerecovery.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class RecoveryRules {

    public String decideAction(Payment payment) {
        return decideAction(payment, 0);
    }

    public String decideAction(Payment payment, long retryCount) {
        if (payment == null) {
            return "NO_ACTION";
        }

        String status = payment.getStatus();

        if ("SUCCESS".equalsIgnoreCase(status) || "CAPTURED".equalsIgnoreCase(status)) {
            return "NO_ACTION";
        }

        if (payment.getAmount() != null && payment.getAmount().doubleValue() > 50000) {
            return "ESCALATE_TO_HUMAN";
        }

        if ("FAILED".equalsIgnoreCase(status)) {
            if (retryCount >= 3) {
                return "SEND_PAYMENT_LINK";
            }
            return "RETRY_PAYMENT";
        }

        if ("PENDING".equalsIgnoreCase(status)) {
            return "EVALUATE";
        }

        return "EVALUATE";
    }

    public String determineAction(Payment payment, long retryCount) {
        return decideAction(payment, retryCount);
    }
}