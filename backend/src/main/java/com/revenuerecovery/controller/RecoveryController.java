package com.revenuerecovery.controller;

import com.revenuerecovery.dto.RecoveryCaseResponse;
import com.revenuerecovery.dto.RecoveryRequest;
import com.revenuerecovery.dto.RecoveryResponse;
import com.revenuerecovery.service.RecoveryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recovery")
public class RecoveryController {

    private final RecoveryService recoveryService;

    public RecoveryController(RecoveryService recoveryService) {
        this.recoveryService = recoveryService;
    }

    @PostMapping
    public ResponseEntity<RecoveryResponse> processRecovery(
            @Valid @RequestBody RecoveryRequest request) {

        RecoveryResponse response =
                recoveryService.processRecovery(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<RecoveryResponse>> processBatchRecovery() {

        List<RecoveryResponse> responses =
                recoveryService.processBatchRecovery();

        return ResponseEntity.ok(responses);
    }

    @GetMapping
    public ResponseEntity<List<RecoveryCaseResponse>> getRecoveryCases() {

        List<RecoveryCaseResponse> recoveryCases =
                recoveryService.getRecoveryCases();

        return ResponseEntity.ok(recoveryCases);
    }
}