from sqlalchemy.orm import Session

from .models import Chat, Message


def create_chat(db: Session, title: str):
    chat = Chat(title=title)

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


def get_chat(db: Session, chat_id: int):
    return db.query(Chat).filter(Chat.id == chat_id).first()


def create_message(
    db: Session,
    chat_id: int,
    sender: str,
    message: str,
):
    msg = Message(
        chat_id=chat_id,
        sender=sender,
        message=message,
    )

    db.add(msg)
    db.commit()
    db.refresh(msg)

    return msg


def get_all_chats(db: Session):
    return (
        db.query(Chat)
        .order_by(Chat.created_at.desc())
        .all()
    )


def get_messages(db: Session, chat_id: int):
    return (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at.asc())
        .all()
    )
