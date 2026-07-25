from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.crud import create_chat
from database.database import get_db
from services.ai_service import ask_ai

router = APIRouter()


class ChatRequest(BaseModel):
    chat_id: int
    message: str


@router.post("/chat/new")
def new_chat(db: Session = Depends(get_db)):
    chat = create_chat(
        db=db,
        title="New Chat"
    )

    return {
        "chat_id": chat.id,
        "title": chat.title
    }


@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    reply = ask_ai(request.message)

    return {
        "reply": reply
    }