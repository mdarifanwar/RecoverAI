package com.revenuerecovery.integration;

import com.revenuerecovery.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class RazorpayClient {

    public boolean retryPayment(Payment payment) {

        if (payment == null) {
            return false;
        }

        if (payment.getRazorpayPaymentId() == null
                || payment.getRazorpayPaymentId().isBlank()) {
            return false;
        }

        return "FAILED".equalsIgnoreCase(payment.getStatus());
    }
}