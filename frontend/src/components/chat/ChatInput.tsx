import { Paperclip, Mic, SendHorizontal } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    const text = message.trim();

    setMessage("");
    setSending(true);

    try {
      await onSend(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3 rounded-2xl bg-slate-800 p-3">
        <button className="text-slate-400 hover:text-cyan-400 transition">
          <Paperclip size={22} />
        </button>

        <input
          type="text"
          placeholder="Ask Ragul AI anything..."
          className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
          value={message}
          disabled={sending}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button className="text-slate-400 hover:text-cyan-400 transition">
          <Mic size={22} />
        </button>

        <button
          onClick={handleSend}
          disabled={sending}
          className="rounded-xl bg-cyan-500 p-3 text-slate-900 hover:bg-cyan-400 transition disabled:opacity-50"
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
