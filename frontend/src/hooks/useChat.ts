import { useEffect, useState } from "react";

import { useChatContext } from "../context/ChatContext";

import {
  createChat,
  deleteChat as deleteChatApi,
  getChats,
  getMessages,
  renameChat as renameChatApi,
  regenerateChat,
  streamChat,
} from "../services/chatService";

import type { Message } from "../types/message";

interface BackendMessage {
  id: number;
  sender: "user" | "ai";
  message: string;
}

export function useChat() {
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

  // ==========================================
  // ABORT CONTROLLER
  // ==========================================

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  // ==========================================
  // LOAD ALL CHATS
  // ==========================================

  const loadChats = async () => {
    try {
      const data = await getChats();

      setChats(data);

      if (data.length > 0 && activeChatId === null) {
        setActiveChatId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  // ==========================================
  // REFRESH CHATS
  // ==========================================

  const refreshChats = async () => {
    await loadChats();
  };

  // ==========================================
  // LOAD MESSAGES
  // ==========================================

  const loadMessages = async (chatId: number) => {
    try {
      const data: BackendMessage[] = await getMessages(chatId);

      const formatted: Message[] = data.map((msg) => ({
        id: msg.id.toString(),
        sender: msg.sender,
        text: msg.message,
      }));

      setMessages(formatted);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  // ==========================================
  // SELECT CHAT
  // ==========================================

  const selectChat = async (chatId: number) => {
    setActiveChatId(chatId);

    await loadMessages(chatId);
  };

  // ==========================================
  // CREATE NEW CHAT
  // ==========================================

  const newChat = async () => {
    try {
      const chat = await createChat();

      await refreshChats();

      setActiveChatId(chat.chat_id);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  // ==========================================
  // SEND MESSAGE WITH STREAMING
  // ==========================================

  const send = async (text: string) => {
    if (!activeChatId || !text.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    // Create an empty AI message.
    const aiMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        sender: "ai",
        text: "",
      },
    ]);

    // Create controller for Stop button.
    const controller = new AbortController();

    setAbortController(controller);

    try {
      await streamChat(
        activeChatId,
        text,
        (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    text: msg.text + chunk,
                  }
                : msg,
            ),
          );
        },
        controller.signal,
      );

      await refreshChats();
    } catch (error) {
      // User intentionally stopped generation.
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        console.error("Failed to stream message:", error);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  text: "⚠️ Sorry, I couldn't complete the response.",
                }
              : msg,
          ),
        );
      }
    } finally {
      setAbortController(null);
      setIsLoading(false);
    }
  };

  // ==========================================
  // STOP GENERATING
  // ==========================================

  const stopGenerating = () => {
    if (!abortController) {
      return;
    }

    abortController.abort();

    setAbortController(null);
    setIsLoading(false);
  };

  // ==========================================
  // REGENERATE AI RESPONSE
  // ==========================================

  const regenerate = async () => {
    if (!activeChatId || isLoading) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    // Regeneration only works when
    // the last message is an AI response.
    if (!lastMessage || lastMessage.sender !== "ai") {
      return;
    }

    const aiMessageId = lastMessage.id;

    // Clear previous AI response.
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === aiMessageId
          ? {
              ...msg,
              text: "",
            }
          : msg,
      ),
    );

    setIsLoading(true);

    // Create controller for regeneration.
    const controller = new AbortController();

    setAbortController(controller);

    try {
      await regenerateChat(activeChatId, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  text: msg.text + chunk,
                }
              : msg,
          ),
        );
      });

      await refreshChats();
    } catch (error) {
      console.error("Failed to regenerate response:", error);
    } finally {
      setAbortController(null);
      setIsLoading(false);
    }
  };

  // ==========================================
  // RENAME CHAT
  // ==========================================

  const rename = async (chatId: number, title: string) => {
    try {
      await renameChatApi(chatId, title);

      await refreshChats();
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  // ==========================================
  // DELETE CHAT
  // ==========================================

  const remove = async (chatId: number) => {
    try {
      await deleteChatApi(chatId);

      const remainingChats = chats.filter((chat) => chat.id !== chatId);

      setChats(remainingChats);

      if (activeChatId === chatId) {
        if (remainingChats.length > 0) {
          const nextChat = remainingChats[0];

          setActiveChatId(nextChat.id);

          await loadMessages(nextChat.id);
        } else {
          setActiveChatId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadChats();
  }, []);

  // ==========================================
  // RETURN
  // ==========================================

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
    regenerate,
    stopGenerating,

    rename,
    remove,
  };
}
