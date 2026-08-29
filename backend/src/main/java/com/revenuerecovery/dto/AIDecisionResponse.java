package com.revenuerecovery.dto;

public class AIDecisionResponse {

    private Long paymentId;
    private String recommendation;
    private String reason;

    public AIDecisionResponse() {
    }

    public AIDecisionResponse(
            Long paymentId,
            String recommendation,
            String reason) {

        this.paymentId = paymentId;
        this.recommendation = recommendation;
        this.reason = reason;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}