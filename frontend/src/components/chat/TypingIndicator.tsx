function TypingIndicator() {
  return (
    <div className="flex justify-start my-4">
      <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-5 py-4">
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
          <span
            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
