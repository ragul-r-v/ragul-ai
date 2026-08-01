import { createContext, useContext } from "react";
import type { Chat } from "../types/chat";
import type { Message } from "../types/message";

interface ChatContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;

  activeChatId: number | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<number | null>>;

  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used inside ChatProvider");
  }

  return context;
}
