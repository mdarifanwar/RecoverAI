package com.revenuerecovery.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_attempts")
public class RecoveryAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String status;

    private java.math.BigDecimal recoveredAmount = java.math.BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDateTime attemptedAt;

    public RecoveryAttempt() {
    }

    public RecoveryAttempt(
            Payment payment,
            String action,
            String status,
            LocalDateTime attemptedAt) {
        this.payment = payment;
        this.action = action;
        this.status = status;
        this.recoveredAmount = java.math.BigDecimal.ZERO;
        this.attemptedAt = attemptedAt;
    }

    public RecoveryAttempt(
            Payment payment,
            String action,
            String status,
            java.math.BigDecimal recoveredAmount,
            LocalDateTime attemptedAt) {
        this.payment = payment;
        this.action = action;
        this.status = status;
        this.recoveredAmount = recoveredAmount != null ? recoveredAmount : java.math.BigDecimal.ZERO;
        this.attemptedAt = attemptedAt;
    }

    public Long getId() {
        return id;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public java.math.BigDecimal getRecoveredAmount() {
        return recoveredAmount;
    }

    public void setRecoveredAmount(java.math.BigDecimal recoveredAmount) {
        this.recoveredAmount = recoveredAmount;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}