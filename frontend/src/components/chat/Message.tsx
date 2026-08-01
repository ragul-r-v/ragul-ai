import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  sender: "user" | "ai";
  message: string;
}

export default function Message({ sender, message }: Props) {
  const isUser = sender === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-4xl rounded-xl px-4 py-3 shadow ${
          isUser ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-100"
        }`}
      >
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
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                }

                return (
                  <code className="rounded bg-slate-700 px-1 py-0.5 text-pink-300">
                    {children}
                  </code>
                );
              },
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
