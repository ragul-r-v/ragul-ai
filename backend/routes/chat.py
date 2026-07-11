from fastapi import APIRouter
from pydantic import BaseModel

from services.ai_service import ask_ai

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(request: ChatRequest):
    reply = ask_ai(request.message)

    return {
        "reply": reply
    }