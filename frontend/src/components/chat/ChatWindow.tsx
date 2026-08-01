import { useEffect, useRef } from "react";
import type { Message } from "../../types/message";
import MessageComponent from "./Message";
import TypingIndicator from "./TypingIndicator";

interface Props {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatWindow({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      {messages.length === 0 && (
        <div className="flex h-full items-center justify-center text-slate-500">
          Start a conversation 👋
        </div>
      )}

      <div className="space-y-4">
        {messages.map((message) => (
          <MessageComponent
            key={message.id}
            sender={message.sender}
            message={message.message}
          />
        ))}

        {isLoading && <TypingIndicator />}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
