package com.revenuerecovery;

import com.revenuerecovery.entity.AIDecision;
import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.repository.AIDecisionRepository;
import com.revenuerecovery.service.AIService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AIServiceTest {

    @Mock
    private AIDecisionRepository aiDecisionRepository;

    private AIService aiService;

    @BeforeEach
    void setUp() {
        aiService = new AIService(aiDecisionRepository);
    }

    @Test
    void shouldRecommendRetryForFailedPayment() {

        Payment payment = new Payment(
                "pay_test_001",
                new BigDecimal("500.00"),
                "FAILED",
                LocalDateTime.now()
        );

        String result = aiService.decideRecoveryAction(payment);

        assertEquals("RETRY_PAYMENT", result);

        verify(aiDecisionRepository)
                .save(any(AIDecision.class));
    }

    @Test
    void shouldRecommendEvaluateForPendingPayment() {

        Payment payment = new Payment(
                "pay_test_002",
                new BigDecimal("500.00"),
                "PENDING",
                LocalDateTime.now()
        );

        String result = aiService.decideRecoveryAction(payment);

        assertEquals("EVALUATE", result);

        verify(aiDecisionRepository)
                .save(any(AIDecision.class));
    }

    @Test
    void shouldRecommendNoActionForSuccessfulPayment() {

        Payment payment = new Payment(
                "pay_test_003",
                new BigDecimal("500.00"),
                "SUCCESS",
                LocalDateTime.now()
        );

        String result = aiService.decideRecoveryAction(payment);

        assertEquals("NO_ACTION", result);

        verify(aiDecisionRepository)
                .save(any(AIDecision.class));
    }

    @Test
    void shouldRecommendNoActionForUnknownStatus() {

        Payment payment = new Payment(
                "pay_test_004",
                new BigDecimal("500.00"),
                "UNKNOWN",
                LocalDateTime.now()
        );

        String result = aiService.decideRecoveryAction(payment);

        assertEquals("NO_ACTION", result);

        verify(aiDecisionRepository)
                .save(any(AIDecision.class));
    }

    @Test
    void shouldReturnNoActionForNullPayment() {

        String result = aiService.decideRecoveryAction(null);

        assertEquals("NO_ACTION", result);
    }

    @Test
    void shouldReturnLatestDecision() {

        Payment payment = new Payment(
                "pay_test_005",
                new BigDecimal("500.00"),
                "FAILED",
                LocalDateTime.now()
        );

        AIDecision decision = new AIDecision(
                payment,
                "RETRY_PAYMENT",
                "Payment failed and is eligible for a retry.",
                LocalDateTime.now()
        );

        when(aiDecisionRepository
                .findTopByPaymentOrderByCreatedAtDesc(payment))
                .thenReturn(Optional.of(decision));

        var response = aiService.getLatestDecision(payment);

        assertNotNull(response);
        assertEquals("RETRY_PAYMENT", response.getRecommendation());
        assertEquals(
                "Payment failed and is eligible for a retry.",
                response.getReason()
        );
    }
}