package com.revenuerecovery;

import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.rules.RecoveryRules;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RecoveryRulesTest {

    private final RecoveryRules recoveryRules = new RecoveryRules();

    @Test
    void shouldRetryFailedPayment() {

        Payment payment = new Payment(
                "pay_test_001",
                new BigDecimal("500.00"),
                "FAILED",
                LocalDateTime.now()
        );

        String action = recoveryRules.decideAction(payment);

        assertEquals("RETRY_PAYMENT", action);
    }

    @Test
    void shouldEvaluatePendingPayment() {

        Payment payment = new Payment(
                "pay_test_002",
                new BigDecimal("500.00"),
                "PENDING",
                LocalDateTime.now()
        );

        String action = recoveryRules.decideAction(payment);

        assertEquals("EVALUATE", action);
    }

    @Test
    void shouldTakeNoActionForSuccessfulPayment() {

        Payment payment = new Payment(
                "pay_test_003",
                new BigDecimal("500.00"),
                "SUCCESS",
                LocalDateTime.now()
        );

        String action = recoveryRules.decideAction(payment);

        assertEquals("NO_ACTION", action);
    }

    @Test
    void shouldTakeNoActionForCapturedPayment() {

        Payment payment = new Payment(
                "pay_test_004",
                new BigDecimal("500.00"),
                "CAPTURED",
                LocalDateTime.now()
        );

        String action = recoveryRules.decideAction(payment);

        assertEquals("NO_ACTION", action);
    }

    @Test
    void shouldEvaluateUnknownPaymentStatus() {

        Payment payment = new Payment(
                "pay_test_005",
                new BigDecimal("500.00"),
                "UNKNOWN",
                LocalDateTime.now()
        );

        String action = recoveryRules.decideAction(payment);

        assertEquals("EVALUATE", action);
    }

    @Test
    void shouldReturnNoActionForNullPayment() {

        String action = recoveryRules.decideAction(null);

        assertEquals("NO_ACTION", action);
    }
}