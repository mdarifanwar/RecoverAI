import json
import os

from dotenv import load_dotenv
from openai import OpenAI

from app.models.schemas import PaymentInput, AIDecisionResponse
from app.services.prompt_service import build_recovery_prompt

load_dotenv()


class AIService:

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

        if api_key and api_key != "your_openai_api_key_here":
            try:
                self.client = OpenAI(api_key=api_key)
            except Exception as e:
                print(f"OpenAI Client Init Notice: {e}")
                self.client = None
        else:
            self.client = None

    def decide_recovery(
        self,
        payment: PaymentInput
    ) -> AIDecisionResponse:
        prob = self._calculate_ml_probability(payment)

        if not self.client:
            return self._fallback_decision(payment, prob)

        try:
            prompt = build_recovery_prompt(payment)
            response = self.client.responses.create(
                model=self.model,
                input=prompt
            )
            result_text = response.output_text.strip()
            result = json.loads(result_text)
            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation=result["recommendation"],
                reason=result["reason"],
                probability_of_recovery=prob
            )
        except Exception as e:
            print(f"OpenAI Decision Fallback: {e}")
            return self._fallback_decision(payment, prob)

    def _calculate_ml_probability(self, payment: PaymentInput) -> float:
        """Calculates recovery probability score based on amount, retries, and failure reasons."""
        base_score = payment.previous_success_rate if payment.previous_success_rate is not None else 0.80

        # Adjust score based on retry penalty
        penalty = payment.retry_count * 0.15
        score = base_score - penalty

        # High amount risk factor
        if payment.amount > 50000:
            score -= 0.25

        reason = (payment.failure_reason or "").upper()
        if "TIMEOUT" in reason or "NETWORK" in reason:
            score += 0.10  # Network glitches are highly recoverable
        elif "INSUFFICIENT" in reason or "EXPIRED" in reason:
            score -= 0.10  # Method issues need user link action

        return max(0.05, min(0.99, round(score, 2)))

    def _fallback_decision(
        self,
        payment: PaymentInput,
        prob: float = 0.82
    ) -> AIDecisionResponse:

        status = payment.status.upper()

        if status in ("SUCCESS", "CAPTURED"):
            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation="NO_ACTION",
                reason="Payment was successful, so no recovery action is required.",
                probability_of_recovery=1.0
            )

        if payment.amount > 50000:
            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation="ESCALATE_TO_HUMAN",
                reason=f"High-value payment (₹{payment.amount:,.2f}) exceeds threshold; probability of recovery: {prob:.2f}.",
                probability_of_recovery=prob
            )

        reason_code = (payment.failure_reason or "").upper()
        if "DECLINED" in reason_code or "EXPIRED" in reason_code or "INSUFFICIENT" in reason_code:
            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation="SEND_PAYMENT_LINK",
                reason=f"Payment method issue detected (Recovery score: {prob:.2f}); sending direct interactive payment link to customer.",
                probability_of_recovery=prob
            )

        if status == "FAILED":
            if payment.retry_count < 3 and prob >= 0.60:
                return AIDecisionResponse(
                    payment_id=payment.payment_id,
                    recommendation="RETRY_PAYMENT",
                    reason=f"High recovery probability score ({prob:.2f}); eligible for automatic payment retry.",
                    probability_of_recovery=prob
                )
            else:
                return AIDecisionResponse(
                    payment_id=payment.payment_id,
                    recommendation="SEND_PAYMENT_LINK",
                    reason=f"Recovery score ({prob:.2f}) indicates payment link recommended.",
                    probability_of_recovery=prob
                )

        return AIDecisionResponse(
            payment_id=payment.payment_id,
            recommendation="EVALUATE",
            reason="Payment requires further evaluation.",
            probability_of_recovery=prob
        )