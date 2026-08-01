import type { Chat } from "../../types/chat";
import ChatItem from "./ChatItem";

interface Props {
  chats: Chat[];
  activeChatId: number | null;
  onSelect: (id: number) => void;
}

export default function ChatList({ chats, activeChatId, onSelect }: Props) {
  if (chats.length === 0) {
    return <div className="p-4 text-center text-gray-500">No chats yet</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          active={activeChatId === chat.id}
          onClick={() => onSelect(chat.id)}
        />
      ))}
    </div>
  );
}
