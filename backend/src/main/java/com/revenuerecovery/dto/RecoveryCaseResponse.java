package com.revenuerecovery.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecoveryCaseResponse {

    private Long recoveryId;
    private Long paymentId;
    private BigDecimal amount;
    private String paymentStatus;
    private String action;
    private String recoveryStatus;
    private BigDecimal recoveredAmount;
    private String failureReason;
    private LocalDateTime attemptedAt;

    public RecoveryCaseResponse() {
    }

    public RecoveryCaseResponse(
            Long recoveryId,
            Long paymentId,
            BigDecimal amount,
            String paymentStatus,
            String action,
            String recoveryStatus,
            BigDecimal recoveredAmount,
            String failureReason,
            LocalDateTime attemptedAt) {

        this.recoveryId = recoveryId;
        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.action = action;
        this.recoveryStatus = recoveryStatus;
        this.recoveredAmount = recoveredAmount;
        this.failureReason = failureReason;
        this.attemptedAt = attemptedAt;
    }

    public Long getRecoveryId() {
        return recoveryId;
    }

    public void setRecoveryId(Long recoveryId) {
        this.recoveryId = recoveryId;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getRecoveryStatus() {
        return recoveryStatus;
    }

    public void setRecoveryStatus(String recoveryStatus) {
        this.recoveryStatus = recoveryStatus;
    }

    public BigDecimal getRecoveredAmount() {
        return recoveredAmount;
    }

    public void setRecoveredAmount(BigDecimal recoveredAmount) {
        this.recoveredAmount = recoveredAmount;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}