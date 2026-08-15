import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import { useChat } from "../hooks/useChat";

function ChatPage() {
  const {
    messages,
    isLoading,
    send,
    activeChatId,
    regenerate,
    stopGenerating,
  } = useChat();

  return (
    <div className="flex h-full flex-col">
      {!activeChatId ? (
        <div className="flex flex-1 items-center justify-center text-slate-500">
          Select a chat or create a new one.
        </div>
      ) : (
        <>
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onRegenerate={regenerate}
          />

          <ChatInput
            onSend={send}
            isLoading={isLoading}
            onStop={stopGenerating}
          />
        </>
      )}
    </div>
  );
}

export default ChatPage;
