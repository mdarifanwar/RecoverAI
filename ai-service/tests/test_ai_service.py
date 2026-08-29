from app.models.schemas import PaymentInput, AIDecisionResponse
from app.evaluation.evaluate import evaluate_decision

def test_success_payment_stopping_rule():
    payment = PaymentInput(payment_id=1, amount=1000.0, status="SUCCESS", retry_count=0)
    decision = AIDecisionResponse(payment_id=1, recommendation="RETRY_PAYMENT", reason="test")
    final = evaluate_decision(payment, decision)
    assert final.recommendation == "NO_ACTION"

def test_high_value_escalation():
    payment = PaymentInput(payment_id=2, amount=75000.0, status="FAILED", retry_count=0)
    decision = AIDecisionResponse(payment_id=2, recommendation="RETRY_PAYMENT", reason="test")
    final = evaluate_decision(payment, decision)
    assert final.recommendation == "ESCALATE_TO_HUMAN"

def test_max_retry_limit():
    payment = PaymentInput(payment_id=3, amount=500.0, status="FAILED", retry_count=3)
    decision = AIDecisionResponse(payment_id=3, recommendation="RETRY_PAYMENT", reason="test")
    final = evaluate_decision(payment, decision)
    assert final.recommendation == "SEND_PAYMENT_LINK"
