import type { Message } from "../../types/message";
import MessageBubble from "./MessageBubble";

type ChatWindowProps = {
  messages: Message[];
};

function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div
      style={{
        height: "500px",
        border: "1px solid #ccc",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}

export default ChatWindow;
