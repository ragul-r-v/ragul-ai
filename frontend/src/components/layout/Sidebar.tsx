import SidebarHeader from "../sidebar/SidebarHeader";
import ChatList from "../sidebar/ChatList";

import { useChat } from "../../hooks/useChat";

export default function Sidebar() {
  const { chats, activeChatId, newChat, selectChat } = useChat();

  return (
    <aside className="w-72 bg-[#202123] text-white flex flex-col border-r border-gray-800">
      <SidebarHeader onNewChat={newChat} />

      <div className="flex-1 overflow-y-auto py-2">
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelect={selectChat}
        />
      </div>
    </aside>
  );
}
