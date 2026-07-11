import type { Message } from "../types/message";

type MessageBubbleProps = {
  message: Message;
};

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          backgroundColor: isUser ? "#0078ff" : "#e5e5e5",
          color: isUser ? "#ffffff" : "#000000",
          padding: "10px 15px",
          borderRadius: "12px",
          maxWidth: "60%",
        }}
      >
        {message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
