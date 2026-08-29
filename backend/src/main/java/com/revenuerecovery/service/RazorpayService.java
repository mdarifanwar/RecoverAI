package com.revenuerecovery.service;

import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.integration.RazorpayClient;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    public RazorpayService(RazorpayClient razorpayClient) {
        this.razorpayClient = razorpayClient;
    }

    public boolean retryPayment(Payment payment) {

        if (payment == null) {
            return false;
        }

        if (payment.getRazorpayPaymentId() == null
                || payment.getRazorpayPaymentId().isBlank()) {
            return false;
        }

        return razorpayClient.retryPayment(payment);
    }
}