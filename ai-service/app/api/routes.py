from fastapi import APIRouter, HTTPException

from app.evaluation.evaluate import evaluate_decision
from app.models.schemas import PaymentInput, AIDecisionResponse
from app.services.ai_service import AIService


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"]
)

ai_service = AIService()


@router.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "RecoverAI AI Service"
    }


@router.post(
    "/decision",
    response_model=AIDecisionResponse
)
def make_recovery_decision(
    payment: PaymentInput
):

    try:
        ai_decision = ai_service.decide_recovery(payment)

        final_decision = evaluate_decision(
            payment,
            ai_decision
        )

        return final_decision

    except Exception as exception:

        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(exception)}"
        )