import { useState } from "react";
import type { Message } from "../../types/message";
import type { Chat } from "../../types/chat";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { ChatContext } from "../../context/ChatContext";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);

  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,

        activeChatId,
        setActiveChatId,

        messages,
        setMessages,

        isLoading,
        setIsLoading,
      }}
    >
      <div className="h-screen bg-slate-950 flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </ChatContext.Provider>
  );
}

export default MainLayout;
