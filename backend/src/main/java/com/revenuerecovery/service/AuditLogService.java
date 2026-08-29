package com.revenuerecovery.service;

import com.revenuerecovery.entity.AuditLog;
import com.revenuerecovery.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog log(
            Long paymentId,
            String action,
            String status) {

        AuditLog auditLog = new AuditLog(
                paymentId,
                action,
                status,
                LocalDateTime.now()
        );

        return auditLogRepository.save(auditLog);
    }
}