package com.revenuerecovery.dto;

public class RecoveryResponse {

    private Long paymentId;
    private String status;
    private String action;

    public RecoveryResponse() {
    }

    public RecoveryResponse(Long paymentId, String status, String action) {
        this.paymentId = paymentId;
        this.status = status;
        this.action = action;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}