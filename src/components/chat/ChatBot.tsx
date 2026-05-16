import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, X, Send, Bot, User as UserIcon, ExternalLink } from "lucide-react";
import { trpc } from "@/providers/trpc";

export function ChatBot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: t("support.title") },
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => `chat_${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessage = trpc.support.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const content = input.trim();
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    sendMessage.mutate({ sessionId, content });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-cyan-400 hover:bg-cyan-500 text-[#040507] rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 transition-all hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] bg-[#0A0C10] border border-[#141821] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#141821] border-b border-[#1A1F2E]">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-[#E8ECF1]">Makara AI</span>
            </div>
            <div className="flex items-center gap-1">
              <a
                href="https://t.me/makara_admin"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-[#7A8299] hover:text-cyan-400 transition-colors"
                title={t("support.contactAdmin")}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#7A8299] hover:text-[#E8ECF1] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-cyan-400/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-cyan-400 text-[#040507]"
                      : "bg-[#141821] text-[#E8ECF1] border border-[#1A1F2E]"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#1A1F2E] flex items-center justify-center flex-shrink-0 mt-1">
                    <UserIcon className="w-4 h-4 text-[#7A8299]" />
                  </div>
                )}
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div className="bg-[#141821] border border-[#1A1F2E] rounded-xl px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#7A8299] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-[#7A8299] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-[#7A8299] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#141821]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("support.placeholder")}
                className="flex-1 bg-[#141821] border border-[#1A1F2E] rounded-lg py-2 px-3 text-sm text-[#E8ECF1] placeholder-[#7A8299] focus:outline-none focus:border-cyan-400/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sendMessage.isPending}
                className="p-2 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 text-[#040507] rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
