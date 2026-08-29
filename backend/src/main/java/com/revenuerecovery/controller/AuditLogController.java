package com.revenuerecovery.controller;

import com.revenuerecovery.entity.AuditLog;
import com.revenuerecovery.repository.AuditLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(
            AuditLogRepository auditLogRepository) {

        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs() {

        List<AuditLog> auditLogs =
                auditLogRepository.findAllByOrderByCreatedAtDesc();

        return ResponseEntity.ok(auditLogs);
    }
}