package com.revenuerecovery.repository;

import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.entity.RecoveryAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecoveryRepository extends JpaRepository<RecoveryAttempt, Long> {

    List<RecoveryAttempt> findAllByPaymentOrderByAttemptedAtDesc(
            Payment payment
    );

    @Query("""
            SELECT COUNT(r)
            FROM RecoveryAttempt r
            WHERE r.payment = :payment
            AND r.action = 'RETRY_PAYMENT'
            """)
    long countRetryAttempts(@Param("payment") Payment payment);

    @Query("""
            SELECT r
            FROM RecoveryAttempt r
            JOIN FETCH r.payment
            ORDER BY r.attemptedAt DESC
            """)
    List<RecoveryAttempt> findAllWithPaymentOrderByAttemptedAtDesc();

    @Query("SELECT COALESCE(SUM(r.recoveredAmount), 0) FROM RecoveryAttempt r")
    java.math.BigDecimal sumTotalRevenueRecovered();
}