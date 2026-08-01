import { useEffect, useState } from "react";
import { createChat, sendMessage } from "../services/chatService";

import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";

import type { Message } from "../types/message";

function ChatPage() {
  const [chatId, setChatId] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "👋 Hello Ragul! I'm your AI Assistant.",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initializeChat() {
      try {
        const chat = await createChat();
        setChatId(chat.chat_id);
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    }

    initializeChat();
  }, []);

  const handleSend = async (text: string) => {
    if (!chatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const reply = await sendMessage(chatId, text);

      const aiMessage: Message = {
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

      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default ChatPage;
