import { useEffect } from "react";
import { useChatContext } from "../context/ChatContext";

import {
  createChat,
  getChats,
  getMessages,
  sendMessage,
} from "../services/chatService";

import type { Message } from "../types/message";

interface BackendMessage {
  id: number;
  sender: "user" | "ai";
  message: string;
}

export default function useChat() {
  const {
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
  } = useChatContext();

  // -------------------------
  // Load all chats
  // -------------------------
  const loadChats = async () => {
    try {
      const data = await getChats();

      setChats(data);

      if (data.length > 0 && activeChatId === null) {
        setActiveChatId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  // -------------------------
  // Refresh chat list
  // -------------------------
  const refreshChats = async () => {
    await loadChats();
  };

  // -------------------------
  // Load conversation
  // -------------------------
  const loadMessages = async (chatId: number) => {
    try {
      const data: BackendMessage[] = await getMessages(chatId);

      const formatted: Message[] = data.map((msg) => ({
        id: msg.id.toString(),
        sender: msg.sender,
        text: msg.message,
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  // -------------------------
  // Select chat
  // -------------------------
  const selectChat = async (chatId: number) => {
    setActiveChatId(chatId);
    await loadMessages(chatId);
  };

  // -------------------------
  // Create new chat
  // -------------------------
  const newChat = async () => {
    try {
      const chat = await createChat();

      await refreshChats();

      setActiveChatId(chat.chat_id);

      setMessages([]);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  // -------------------------
  // Send message
  // -------------------------
  const send = async (text: string) => {
    if (!activeChatId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const reply = await sendMessage(activeChatId, text);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // Initial load
  // -------------------------
  useEffect(() => {
    loadChats();
  }, []);

  return {
    chats,
    messages,
    activeChatId,
    isLoading,

    loadChats,
    refreshChats,
    loadMessages,

    selectChat,

    newChat,

    send,
  };
}
