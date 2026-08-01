import ChatItem from "./ChatItem";
import { Chat } from "../../types/chat";

interface Props {
  chats: Chat[];
  activeChatId: number | null;
  onSelect: (id: number) => void;
}

export default function ChatList({ chats, activeChatId, onSelect }: Props) {
  if (chats.length === 0) {
    return <div className="text-center text-gray-500 mt-10">No chats yet</div>;
  }

  return (
    <div className="flex flex-col gap-1 px-2">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          active={chat.id === activeChatId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
