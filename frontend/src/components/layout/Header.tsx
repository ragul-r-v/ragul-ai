import { Bot } from "lucide-react";

function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Bot className="text-cyan-400" size={28} />

        <div>
          <h1 className="text-lg font-bold text-white">Ragul AI</h1>

          <p className="text-xs text-slate-400">Personal AI Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />

        <span className="text-sm text-slate-400">Online</span>
      </div>
    </header>
  );
}

export default Header;
