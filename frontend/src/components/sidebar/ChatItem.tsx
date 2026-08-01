import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Chat } from "../../types/chat";
import { useChat } from "../../hooks/useChat";

interface Props {
  chat: Chat;
  active: boolean;
  onSelect: (id: number) => void;
}

export default function ChatItem({ chat, active, onSelect }: Props) {
  const { rename, remove } = useChat();

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle(chat.title);
  }, [chat.title]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function saveRename() {
    const newTitle = title.trim();

    if (!newTitle) {
      setTitle(chat.title);
      setEditing(false);
      return;
    }

    await rename(chat.id, newTitle);

    setEditing(false);
  }

  async function deleteCurrentChat() {
    const confirmed = window.confirm("Delete this chat?");

    if (!confirmed) return;

    await remove(chat.id);
  }

  return (
    <div
      className={`group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition ${
        active ? "bg-gray-700" : "hover:bg-gray-800"
      }`}
      onClick={() => onSelect(chat.id)}
    >
      {editing ? (
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveRename();
            }

            if (e.key === "Escape") {
              setEditing(false);
              setTitle(chat.title);
            }
          }}
          className="bg-transparent outline-none flex-1 text-sm"
        />
      ) : (
        <span className="truncate flex-1 text-sm">{chat.title}</span>
      )}

      <div
        ref={menuRef}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-gray-600"
        >
          <MoreHorizontal size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-lg bg-[#202123] shadow-lg border border-gray-700 z-50">
            <button
              onClick={() => {
                setEditing(true);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-700 text-sm"
            >
              <Pencil size={16} />
              Rename
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                deleteCurrentChat();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 hover:bg-red-600 text-sm text-red-400"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
