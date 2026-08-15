import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  sender: "user" | "ai";
  message: string;
  isStreaming?: boolean;
}

export default function Message({
  sender,
  message,
  isStreaming = false,
}: Props) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-4xl rounded-2xl px-5 py-4 ${
          isUser ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message}</p>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ children, className }) {
                  const match = /language-(\w+)/.exec(className || "");

                  if (match) {
                    return (
                      <SyntaxHighlighter
                        language={match[1]}
                        style={oneDark}
                        PreTag="div"
                        customStyle={{
                          margin: "1rem 0",
                          borderRadius: "0.75rem",
                          padding: "1rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }

                  return (
                    <code className="rounded bg-slate-700 px-1.5 py-0.5 text-pink-300">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message}
            </ReactMarkdown>

            {isStreaming && (
              <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded-sm bg-cyan-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
