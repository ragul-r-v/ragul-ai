import { useState } from "react";
import { sendChatMessage } from "../services/chatService";

import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";

import type { Message } from "../types/message";

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "👋 Hello Ragul! I'm your AI Assistant.",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(text);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ChatWindow messages={messages} isLoading={isLoading} />

      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default ChatPage;
