import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import useChat from "../hooks/useChat";

function ChatPage() {
  const { messages, isLoading, send, activeChatId } = useChat();

  return (
    <div className="flex h-full flex-col">
      {!activeChatId ? (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Select a chat or create a new one.
        </div>
      ) : (
        <>
          <ChatWindow messages={messages} isLoading={isLoading} />

          <ChatInput onSend={send} />
        </>
      )}
    </div>
  );
}

export default ChatPage;
