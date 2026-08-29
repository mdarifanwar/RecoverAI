package com.revenuerecovery;

import com.revenuerecovery.dto.RecoveryRequest;
import com.revenuerecovery.dto.RecoveryResponse;
import com.revenuerecovery.entity.Payment;
import com.revenuerecovery.repository.PaymentRepository;
import com.revenuerecovery.repository.RecoveryRepository;
import com.revenuerecovery.service.AIService;
import com.revenuerecovery.service.AuditLogService;
import com.revenuerecovery.service.RazorpayService;
import com.revenuerecovery.service.RecoveryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyLong;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecoveryServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private RecoveryRepository recoveryRepository;

    @Mock
    private AIService aiService;

    @Mock
    private RazorpayService razorpayService;

    @Mock
    private AuditLogService auditLogService;

    private RecoveryService recoveryService;

    private Payment payment;

    @BeforeEach
    void setUp() throws Exception {

        recoveryService = new RecoveryService(
                paymentRepository,
                recoveryRepository,
                aiService,
                razorpayService,
                auditLogService
        );

        payment = new Payment(
                "pay_test_001",
                new BigDecimal("500.00"),
                "FAILED",
                LocalDateTime.now()
        );

        Field idField = Payment.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(payment, 1L);
    }

    @Test
    void shouldInitiateRetryForFailedPayment() {

        when(paymentRepository.findById(1L))
                .thenReturn(Optional.of(payment));

        when(recoveryRepository.countRetryAttempts(payment))
                .thenReturn(0L);

        when(aiService.decideRecoveryAction(payment, 0L))
                .thenReturn("RETRY_PAYMENT");

        when(razorpayService.retryPayment(payment))
                .thenReturn(true);

        RecoveryRequest request = new RecoveryRequest();
        request.setPaymentId(1L);

        RecoveryResponse response =
                recoveryService.processRecovery(request);

        assertEquals(1L, response.getPaymentId());
        assertEquals("RECOVERED", response.getStatus());
        assertEquals("RETRY_PAYMENT", response.getAction());

        verify(paymentRepository).findById(1L);

        verify(aiService)
                .decideRecoveryAction(payment, 0L);

        verify(razorpayService)
                .retryPayment(payment);

        verify(recoveryRepository)
                .save(any());

        verify(auditLogService)
                .log(
                        1L,
                        "RETRY_PAYMENT",
                        "RECOVERED"
                );
    }

    @Test
    void shouldReturnRetryFailedWhenRazorpayRetryFails() {

        when(paymentRepository.findById(1L))
                .thenReturn(Optional.of(payment));

        when(recoveryRepository.countRetryAttempts(payment))
                .thenReturn(0L);

        when(aiService.decideRecoveryAction(payment, 0L))
                .thenReturn("RETRY_PAYMENT");

        when(razorpayService.retryPayment(payment))
                .thenReturn(false);

        RecoveryRequest request = new RecoveryRequest();
        request.setPaymentId(1L);

        RecoveryResponse response =
                recoveryService.processRecovery(request);

        assertEquals(1L, response.getPaymentId());
        assertEquals("RETRY_FAILED", response.getStatus());
        assertEquals("RETRY_PAYMENT", response.getAction());

        verify(paymentRepository)
                .findById(1L);

        verify(aiService)
                .decideRecoveryAction(payment, 0L);

        verify(razorpayService)
                .retryPayment(payment);

        verify(recoveryRepository)
                .save(any());

        verify(auditLogService)
                .log(
                        1L,
                        "RETRY_PAYMENT",
                        "RETRY_FAILED"
                );
    }

    @Test
    void shouldReturnPendingWhenActionIsNotRetryPayment() {

        when(paymentRepository.findById(1L))
                .thenReturn(Optional.of(payment));

        when(recoveryRepository.countRetryAttempts(payment))
                .thenReturn(0L);

        when(aiService.decideRecoveryAction(payment, 0L))
                .thenReturn("EVALUATE");

        RecoveryRequest request = new RecoveryRequest();
        request.setPaymentId(1L);

        RecoveryResponse response =
                recoveryService.processRecovery(request);

        assertEquals(1L, response.getPaymentId());
        assertEquals("PENDING", response.getStatus());
        assertEquals("EVALUATE", response.getAction());

        verify(paymentRepository)
                .findById(1L);

        verify(aiService)
                .decideRecoveryAction(payment, 0L);

        verify(razorpayService, never())
                .retryPayment(any());

        verify(recoveryRepository)
                .save(any());

        verify(auditLogService)
                .log(
                        1L,
                        "EVALUATE",
                        "PENDING"
                );
    }

    @Test
    void shouldThrowExceptionWhenPaymentDoesNotExist() {

        when(paymentRepository.findById(999L))
                .thenReturn(Optional.empty());

        RecoveryRequest request = new RecoveryRequest();
        request.setPaymentId(999L);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> recoveryService.processRecovery(request)
        );

        assertEquals(
                "Payment not found",
                exception.getMessage()
        );

        verify(paymentRepository)
                .findById(999L);

        verify(aiService, never())
                .decideRecoveryAction(any(), anyLong());

        verify(recoveryRepository, never())
                .save(any());

        verify(auditLogService, never())
                .log(
                        anyLong(),
                        anyString(),
                        anyString()
                );
    }
}