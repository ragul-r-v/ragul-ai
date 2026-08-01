import type { Chat } from "../../types/chat";

interface Props {
  chat: Chat;
  active: boolean;
  onClick: () => void;
}

export default function ChatItem({ chat, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg px-3 py-2 transition-all duration-200
      ${
        active
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      <p className="truncate font-medium">{chat.title}</p>
    </button>
  );
}
