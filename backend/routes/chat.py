from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.crud import (
    create_chat,
    create_message,
    get_chat,
)
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
    chat = get_chat(db, request.chat_id)

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    # Save user message
    create_message(
        db=db,
        chat_id=request.chat_id,
        sender="user",
        message=request.message
    )

    # Ask Gemini
    reply = ask_ai(request.message)

    # Save AI response
    create_message(
        db=db,
        chat_id=request.chat_id,
        sender="ai",
        message=reply
    )

    return {
        "reply": reply
    }