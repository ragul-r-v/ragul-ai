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
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h2 className="text-xl font-semibold text-slate-300">
              Welcome to Ragul AI
            </h2>
            <p className="mt-2 text-sm">Ask me anything.</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-4xl space-y-5">
          {messages.map((message, index) => (
            <MessageComponent
              key={message.id}
              sender={message.sender}
              message={message.text}
              isStreaming={
                isLoading &&
                message.sender === "ai" &&
                index === messages.length - 1
              }
            />
          ))}

          {isLoading && messages[messages.length - 1]?.sender === "user" && (
            <TypingIndicator />
          )}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
