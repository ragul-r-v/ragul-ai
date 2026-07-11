import { MessageSquarePlus } from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-5">
        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition p-3 font-semibold text-slate-900">
          <MessageSquarePlus size={20} />
          New Chat
        </button>
      </div>

      <div className="px-5 text-slate-400 text-sm">Recent Chats</div>

      <div className="flex-1 p-5 space-y-2">
        <div className="rounded-lg bg-slate-800 p-3 cursor-pointer hover:bg-slate-700 transition">
          Welcome Chat
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
