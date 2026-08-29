import json
import os

from dotenv import load_dotenv
from openai import OpenAI

from app.models.schemas import PaymentInput, AIDecisionResponse
from app.services.prompt_service import build_recovery_prompt


load_dotenv()


class AIService:

    def __init__(self):

        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY is missing. "
                "Make sure your .env file exists in the ai-service folder."
            )

        self.client = OpenAI(
            api_key=api_key
        )

        self.model = os.getenv(
            "OPENAI_MODEL",
            "gpt-5.5"
        )

    def decide_recovery(
        self,
        payment: PaymentInput
    ) -> AIDecisionResponse:

        prompt = build_recovery_prompt(payment)

        response = self.client.responses.create(
            model=self.model,
            input=prompt
        )

        result_text = response.output_text.strip()

        try:

            result = json.loads(result_text)

            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation=result["recommendation"],
                reason=result["reason"]
            )

        except (
            json.JSONDecodeError,
            KeyError,
            TypeError
        ):

            return self._fallback_decision(payment)

    def _fallback_decision(
        self,
        payment: PaymentInput
    ) -> AIDecisionResponse:

        status = payment.status.upper()

        if status in ("SUCCESS", "CAPTURED"):
            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation="NO_ACTION",
                reason="Payment was successful, so no recovery action is required."
            )

        if payment.amount > 50000:
            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation="ESCALATE_TO_HUMAN",
                reason="High-value payment exceeds threshold; escalated to finance team."
            )

        reason_code = (payment.failure_reason or "").upper()
        if "DECLINED" in reason_code or "EXPIRED" in reason_code or "INSUFFICIENT" in reason_code:
            return AIDecisionResponse(
                payment_id=payment.payment_id,
                recommendation="SEND_PAYMENT_LINK",
                reason="Payment method issue detected; sending direct interactive payment link to customer."
            )

        if status == "FAILED":
            if payment.retry_count < 3:
                return AIDecisionResponse(
                    payment_id=payment.payment_id,
                    recommendation="RETRY_PAYMENT",
                    reason="Transient payment failure; eligible for automatic payment retry."
                )
            else:
                return AIDecisionResponse(
                    payment_id=payment.payment_id,
                    recommendation="SEND_PAYMENT_LINK",
                    reason="Maximum auto-retries reached; escalating via SMS/Email payment link."
                )

        return AIDecisionResponse(
            payment_id=payment.payment_id,
            recommendation="EVALUATE",
            reason="Payment requires further evaluation."
        )