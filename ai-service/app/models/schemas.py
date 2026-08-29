from typing import Literal

from pydantic import BaseModel, Field


class PaymentInput(BaseModel):
    payment_id: int = Field(..., gt=0)
    amount: float = Field(..., ge=0)
    status: str
    retry_count: int = Field(default=0, ge=0)
    customer_id: int | None = None
    failure_reason: str | None = "UNKNOWN"
    escalation_stage: int = Field(default=1, ge=1)


class AIDecisionResponse(BaseModel):
    payment_id: int
    recommendation: Literal[
        "RETRY_PAYMENT",
        "SEND_PAYMENT_LINK",
        "ESCALATE_TO_HUMAN",
        "NO_ACTION",
        "EVALUATE"
    ]
    reason: str