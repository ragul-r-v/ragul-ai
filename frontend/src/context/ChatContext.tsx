import { createContext, useContext } from "react";
import type { Message } from "../types/message";
import type { Chat } from "../types/chat";

export type ChatContextType = {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;

  activeChatId: number | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<number | null>>;

  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used inside ChatContext");
  }

  return context;
}
