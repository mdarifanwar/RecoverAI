package com.revenuerecovery.controller;

import com.revenuerecovery.dto.AIDecisionResponse;
import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.repository.PaymentRepository;
import com.revenuerecovery.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;
    private final PaymentRepository paymentRepository;

    public AIController(
            AIService aiService,
            PaymentRepository paymentRepository) {

        this.aiService = aiService;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/decision/{paymentId}")
    public ResponseEntity<AIDecisionResponse> makeDecision(
            @PathVariable Long paymentId) {

        Payment payment = paymentRepository
                .findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        aiService.decideRecoveryAction(payment);

        AIDecisionResponse response =
                aiService.getLatestDecision(payment);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/decision/{paymentId}")
    public ResponseEntity<AIDecisionResponse> getLatestDecision(
            @PathVariable Long paymentId) {

        Payment payment = paymentRepository
                .findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        AIDecisionResponse response =
                aiService.getLatestDecision(payment);

        return ResponseEntity.ok(response);
    }
}