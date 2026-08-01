import { useEffect } from "react";

import { useChatContext } from "../context/ChatContext";

import {
  createChat,
  deleteChat as deleteChatApi,
  getChats,
  getMessages,
  renameChat as renameChatApi,
  sendMessage,
} from "../services/chatService";

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

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    const allChats = await getChats();

    setChats(allChats);

    if (allChats.length > 0 && !activeChatId) {
      selectChat(allChats[0].id);
    }
  }

  async function refreshChats() {
    const allChats = await getChats();
    setChats(allChats);
  }

  async function loadMessages(chatId: number) {
    const msgs = await getMessages(chatId);
    setMessages(msgs);
  }

  async function selectChat(chatId: number) {
    setActiveChatId(chatId);
    await loadMessages(chatId);
  }

  async function newChat() {
    const chat = await createChat();

    await refreshChats();
    await selectChat(chat.chat_id);
  }

  async function send(message: string) {
    if (!activeChatId) return;

    setIsLoading(true);

    try {
      await sendMessage(activeChatId, message);

      await loadMessages(activeChatId);
      await refreshChats();
    } finally {
      setIsLoading(false);
    }
  }

  async function rename(chatId: number, title: string) {
    await renameChatApi(chatId, title);

    await refreshChats();
  }

  async function remove(chatId: number) {
    await deleteChatApi(chatId);

    const remaining = chats.filter((chat) => chat.id !== chatId);

    setChats(remaining);

    if (activeChatId === chatId) {
      if (remaining.length > 0) {
        await selectChat(remaining[0].id);
      } else {
        setActiveChatId(null);
        setMessages([]);
      }
    }
  }

  return {
    chats,
    messages,
    activeChatId,
    isLoading,

    newChat,
    selectChat,
    send,

    rename,
    remove,

    refreshChats,
  };
}
