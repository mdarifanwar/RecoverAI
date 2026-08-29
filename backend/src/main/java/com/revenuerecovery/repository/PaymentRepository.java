package com.revenuerecovery.repository;

import com.revenuerecovery.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    boolean existsByRazorpayPaymentId(String razorpayPaymentId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE UPPER(p.status) = 'FAILED' OR UPPER(p.status) = 'PENDING'")
    BigDecimal sumTotalRevenueAtRisk();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p")
    BigDecimal sumTotalPaymentsAmount();
}