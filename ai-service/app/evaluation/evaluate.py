from app.models.schemas import PaymentInput, AIDecisionResponse


def evaluate_decision(
    payment: PaymentInput,
    decision: AIDecisionResponse
) -> AIDecisionResponse:

    status = payment.status.upper()
    retry_count = payment.retry_count

    # SUCCESS/CAPTURED payments should never trigger recovery actions.
    if status in ("SUCCESS", "CAPTURED"):
        return AIDecisionResponse(
            payment_id=payment.payment_id,
            recommendation="NO_ACTION",
            reason="Payment was successful, so no recovery action is required."
        )

    # High-value stopping rule.
    if payment.amount > 50000:
        return AIDecisionResponse(
            payment_id=payment.payment_id,
            recommendation="ESCALATE_TO_HUMAN",
            reason="High-value payment requires manual compliance review by finance team."
        )

    # Payments with 3 or more retries should not trigger RETRY_PAYMENT again.
    if retry_count >= 3 and decision.recommendation == "RETRY_PAYMENT":
        return AIDecisionResponse(
            payment_id=payment.payment_id,
            recommendation="SEND_PAYMENT_LINK",
            reason="Maximum auto-retries reached; escalated to customer payment link."
        )

    # Pass through valid AI recommendation if appropriate for FAILED payments.
    if status == "FAILED":
        if decision.recommendation in ("RETRY_PAYMENT", "SEND_PAYMENT_LINK", "ESCALATE_TO_HUMAN"):
            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation=decision.recommendation,
                reason=decision.reason
            )

    # PENDING or unrecognized status.
    return AIDecisionResponse(
        payment_id=payment.payment_id,
        recommendation="EVALUATE",
        reason="Payment status requires evaluation."
    )