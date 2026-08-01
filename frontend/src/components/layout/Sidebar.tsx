import useChat from "../../hooks/useChat";
import SidebarHeader from "../sidebar/SidebarHeader";
import ChatList from "../sidebar/ChatList";

export default function Sidebar() {
  const { chats, activeChatId, newChat, selectChat } = useChat();

  return (
    <aside className="w-72 h-screen border-r bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <SidebarHeader onNewChat={newChat} />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelect={selectChat}
        />
      </div>
    </aside>
  );
}
