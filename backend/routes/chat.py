from services.ai_service import ask_ai, stream_ai
from fastapi.responses import StreamingResponse
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
from database.database import get_db
from services.ai_service import ask_ai

router = APIRouter()


# -----------------------------
# Request Models
# -----------------------------
class ChatRequest(BaseModel):
    chat_id: int
    message: str


class RenameChatRequest(BaseModel):
    title: str


# -----------------------------
# Create New Chat
# -----------------------------
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


# -----------------------------
# Send Message
# -----------------------------
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

    # Auto rename only for first message
    if chat.title == "New Chat":
        title = request.message.strip()

        if len(title) > 40:
            title = title[:40] + "..."

        update_chat_title(
            db=db,
            chat_id=chat.id,
            title=title,
        )

        # Refresh chat object
        chat = get_chat(db, chat.id)

    # Ask AI
    history = get_messages(
        db=db,
        chat_id=request.chat_id,
    )

    reply = ask_ai(history)

    # Save AI response
    create_message(
        db=db,
        chat_id=request.chat_id,
        sender="ai",
        message=reply
    )

    return {
        "reply": reply,
        "chat_id": chat.id,
        "title": chat.title,
    }


# -----------------------------
# Get All Chats
# -----------------------------
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


# -----------------------------
# Get Messages
# -----------------------------
@router.get("/chat/{chat_id}/messages")
def chat_messages(
    chat_id: int,
    db: Session = Depends(get_db)
):
    chat = get_chat(db, chat_id)

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

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


# -----------------------------
# Rename Chat
# -----------------------------
@router.put("/chat/{chat_id}")
def rename_chat(
    chat_id: int,
    request: RenameChatRequest,
    db: Session = Depends(get_db),
):
    chat = update_chat_title(
        db=db,
        chat_id=chat_id,
        title=request.title,
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    return {
        "success": True,
        "chat": {
            "id": chat.id,
            "title": chat.title,
        },
    }


# -----------------------------
# Delete Chat
# -----------------------------
@router.delete("/chat/{chat_id}")
def remove_chat(
    chat_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_chat(
        db=db,
        chat_id=chat_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    return {
        "success": True,
        "deleted_chat_id": chat_id,
    }


@router.post("/chat/stream")
def stream_chat(
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

    # Auto-title first message
    if chat.title == "New Chat":
        title = request.message.strip()

        if len(title) > 40:
            title = title[:40] + "..."

        update_chat_title(
            db=db,
            chat_id=chat.id,
            title=title
        )

    # Get complete conversation history
    history = get_messages(
        db=db,
        chat_id=request.chat_id
    )

    def generate():
        full_response = ""

        for chunk in stream_ai(history):
            full_response += chunk
            yield chunk

        # Save complete AI response after streaming finishes
        create_message(
            db=db,
            chat_id=request.chat_id,
            sender="ai",
            message=full_response
        )

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )

@router.post("/chat/{chat_id}/regenerate")
def regenerate_chat(
    chat_id: int,
    db: Session = Depends(get_db),
):
    chat = get_chat(db, chat_id)

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    history = get_messages(
        db=db,
        chat_id=chat_id,
    )

    if not history:
        raise HTTPException(
            status_code=400,
            detail="No messages available to regenerate",
        )

    # The last message should normally be the AI response.
    last_message = history[-1]

    if last_message.sender != "ai":
        raise HTTPException(
            status_code=400,
            detail="No AI response available to regenerate",
        )

    # Find the user message immediately before the AI response.
    user_message = None

    for message in reversed(history[:-1]):
        if message.sender == "user":
            user_message = message
            break

    if not user_message:
        raise HTTPException(
            status_code=400,
            detail="No user message found",
        )

    # Remove the previous AI response.
    db.delete(last_message)
    db.commit()

    # Reload history without the previous AI response.
    history = get_messages(
        db=db,
        chat_id=chat_id,
    )

    def generate():
        full_response = ""

        for chunk in stream_ai(history):
            full_response += chunk
            yield chunk

        create_message(
            db=db,
            chat_id=chat_id,
            sender="ai",
            message=full_response,
        )

    return StreamingResponse(
        generate(),
        media_type="text/plain",
    )