package com.revenuerecovery.repository;

import com.revenuerecovery.entity.AIDecision;
import com.revenuerecovery.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AIDecisionRepository
        extends JpaRepository<AIDecision, Long> {

    List<AIDecision> findByPaymentOrderByCreatedAtDesc(Payment payment);

    Optional<AIDecision> findTopByPaymentOrderByCreatedAtDesc(Payment payment);
}