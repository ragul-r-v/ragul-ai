interface Props {
  onNewChat: () => void;
}

export default function SidebarHeader({ onNewChat }: Props) {
  return (
    <div className="p-4 border-b">
      <button
        onClick={onNewChat}
        className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 transition"
      >
        + New Chat
      </button>
    </div>
  );
}
