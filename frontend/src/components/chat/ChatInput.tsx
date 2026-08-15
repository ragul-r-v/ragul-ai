import { Paperclip, Mic, SendHorizontal, Square } from "lucide-react";

import { useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
};

function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || isLoading) {
      return;
    }

    onSend(message);
    setMessage("");
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3 rounded-2xl bg-slate-800 p-3">
        <button
          type="button"
          disabled={isLoading}
          className="text-slate-400 transition hover:text-cyan-400 disabled:opacity-40"
        >
          <Paperclip size={22} />
        </button>

        <input
          type="text"
          placeholder={
            isLoading ? "Ragul AI is thinking..." : "Ask Ragul AI anything..."
          }
          disabled={isLoading}
          className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          type="button"
          disabled={isLoading}
          className="text-slate-400 transition hover:text-cyan-400 disabled:opacity-40"
        >
          <Mic size={22} />
        </button>

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="rounded-xl bg-red-500 p-3 text-white transition hover:bg-red-400"
            title="Stop generating"
          >
            <Square size={18} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            className="rounded-xl bg-cyan-500 p-3 text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizontal size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatInput;
