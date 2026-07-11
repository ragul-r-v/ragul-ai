import { useState } from "react";

type ChatInputProps = {
  onSend: (text: string) => void;
};

function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
        }}
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatInput;
