from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.crud import (
    create_chat,
    create_message,
    get_chat,
    get_all_chats,
    get_messages,
    update_chat_title,
    delete_chat,
)



from database.crud import (
    create_chat,
    create_message,
    get_chat,
    get_all_chats,
    get_messages,
)
from database.database import get_db
from services.ai_service import ask_ai

router = APIRouter()


class ChatRequest(BaseModel):
    chat_id: int
    message: str

class RenameChatRequest(BaseModel):
    title: str

@router.put("/chat/{chat_id}")
def rename_chat(
    chat_id: int,
    request: RenameChatRequest,
    db: Session = Depends(get_db),
):
    chat = update_chat_title(
        db,
        chat_id,
        request.title,
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    return {
        "success": True
    }


@router.delete("/chat/{chat_id}")
def remove_chat(
    chat_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_chat(db, chat_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    return {
        "success": True
    }





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

    if chat.title == "New Chat":
    title = request.message.strip()

    if len(title) > 40:
        title = title[:40] + "..."

    update_chat_title(
        db=db,
        chat_id=chat.id,
        title=title,
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

@router.get("/chats")
def list_chats(db: Session = Depends(get_db)):
    chats = get_all_chats(db)

    return [
        {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at,
        }
        for chat in chats
    ]


@router.get("/chat/{chat_id}/messages")
def chat_messages(
    chat_id: int,
    db: Session = Depends(get_db)
):
    messages = get_messages(db, chat_id)

    return [
        {
            "id": message.id,
            "sender": message.sender,
            "message": message.message,
            "created_at": message.created_at,
        }
        for message in messages
    ]