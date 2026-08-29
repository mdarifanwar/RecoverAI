package com.revenuerecovery.dto;

import jakarta.validation.constraints.NotNull;

public class RecoveryRequest {

    @NotNull
    private Long paymentId;

    public RecoveryRequest() {
    }

    public RecoveryRequest(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }
}