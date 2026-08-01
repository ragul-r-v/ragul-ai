import { useEffect } from "react";
import { MessageSquarePlus } from "lucide-react";

import { useChat } from "../../context/ChatContext";
import { createChat, getChats } from "../../services/chatService";

function Sidebar() {
  const { chats, setChats, activeChatId, setActiveChatId, setMessages } =
    useChat();

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    try {
      const data = await getChats();

      setChats(data);

      if (data.length > 0) {
        setActiveChatId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleNewChat() {
    try {
      const chat = await createChat();

      const updatedChats = await getChats();

      setChats(updatedChats);

      setActiveChatId(chat.chat_id);

      setMessages([]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-5">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition p-3 font-semibold text-slate-900"
        >
          <MessageSquarePlus size={20} />
          New Chat
        </button>
      </div>

      <div className="px-5 text-slate-400 text-sm">Recent Chats</div>

      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`rounded-lg p-3 cursor-pointer transition
              ${
                activeChatId === chat.id
                  ? "bg-cyan-500 text-slate-900"
                  : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
