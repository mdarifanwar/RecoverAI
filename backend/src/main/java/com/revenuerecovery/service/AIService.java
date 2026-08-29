package com.revenuerecovery.service;

import com.revenuerecovery.dto.AIDecisionResponse;
import com.revenuerecovery.entity.AIDecision;
import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.repository.AIDecisionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    private final AIDecisionRepository aiDecisionRepository;
    private final RestClient restClient;

    public AIService(
            AIDecisionRepository aiDecisionRepository,
            @Value("${ai.service.url:http://localhost:8000}") String aiServiceUrl
    ) {

        this.aiDecisionRepository = aiDecisionRepository;

        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }

    /*
     * This method is used by AIController.
     *
     * AIController sends only the Payment object,
     * so we use retryCount = 0 by default.
     */
    public String decideRecoveryAction(Payment payment) {

        return decideRecoveryAction(payment, 0);
    }

    /*
     * This method is used by RecoveryService.
     *
     * RecoveryService can provide the actual retry count.
     */
    public String decideRecoveryAction(
            Payment payment,
            long retryCount) {

        if (payment == null) {
            return "NO_ACTION";
        }

        try {

            Map<String, Object> request = new HashMap<>();

            request.put("payment_id", payment.getId());
            request.put("amount", payment.getAmount());
            request.put("status", payment.getStatus());
            request.put("retry_count", retryCount);
            request.put("failure_reason", payment.getFailureReason() != null ? payment.getFailureReason() : "UNKNOWN");
            request.put("escalation_stage", retryCount + 1);
            request.put("customer_id", null);

            AIDecisionResponse aiResponse = restClient
                    .post()
                    .uri("/api/ai/decision")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(AIDecisionResponse.class);

            if (aiResponse == null) {

                return saveFallbackDecision(
                        payment,
                        retryCount
                );
            }

            String recommendation =
                    aiResponse.getRecommendation();

            String reason =
                    aiResponse.getReason();

            AIDecision decision = new AIDecision(
                    payment,
                    recommendation,
                    reason,
                    LocalDateTime.now()
            );

            aiDecisionRepository.save(decision);

            return recommendation;

        } catch (Exception exception) {

            return saveFallbackDecision(
                    payment,
                    retryCount
            );
        }
    }

    /*
     * Fallback decision.
     *
     * Used when the AI service is unavailable or returns an error.
     */
    private String saveFallbackDecision(
            Payment payment,
            long retryCount) {

        String recommendation;
        String reason;

        String status = payment.getStatus();

        if ("SUCCESS".equalsIgnoreCase(status) || "CAPTURED".equalsIgnoreCase(status)) {

            recommendation = "NO_ACTION";
            reason = "Payment was successful, so no recovery action is required.";

        } else if (payment.getAmount() != null && payment.getAmount().doubleValue() > 50000) {

            recommendation = "ESCALATE_TO_HUMAN";
            reason = "High-value payment exceeds automatic threshold; escalated to finance operator.";

        } else if ("FAILED".equalsIgnoreCase(status) && retryCount < 3) {

            recommendation = "RETRY_PAYMENT";
            reason = "Payment failed and is eligible for an automatic retry.";

        } else if ("FAILED".equalsIgnoreCase(status) && retryCount >= 3) {

            recommendation = "SEND_PAYMENT_LINK";
            reason = "Maximum payment retries reached; sent interactive payment link to customer.";

        } else {

            recommendation = "EVALUATE";
            reason = "Payment requires further evaluation.";
        }

        AIDecision decision = new AIDecision(
                payment,
                recommendation,
                reason,
                LocalDateTime.now()
        );

        aiDecisionRepository.save(decision);

        return recommendation;
    }

    /*
     * Get the most recent AI decision for a payment.
     */
    public AIDecisionResponse getLatestDecision(
            Payment payment) {

        return aiDecisionRepository
                .findTopByPaymentOrderByCreatedAtDesc(payment)
                .map(decision ->
                        new AIDecisionResponse(
                                payment.getId(),
                                decision.getRecommendation(),
                                decision.getReason()
                        )
                )
                .orElse(
                        new AIDecisionResponse(
                                payment.getId(),
                                "NO_ACTION",
                                "No AI decision found for this payment."
                        )
                );
    }
}