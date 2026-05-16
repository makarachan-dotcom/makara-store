import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { MessageCircle, X, Send, User, Bot, MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatBot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: t(
        "Welcome to Makara Store! I'm your AI assistant. How can I help you today?",
        "សូមស្វាគមន៍មកកាន់ Makara Store! ខ្ញុំជាអ្នកជំនួយការ AI របស់អ្នក។ តើខ្ញុំអាចជួយអ្នកយ៉ាងដូចម្តេចថ្ងៃនេះ?"
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        t("I'd be happy to help! You can browse our products in the Products section above.", "ខ្ញុំរីករាយជួយអ្នក! អ្នកអាចរកមើលផលិតផលរបស់យើងក្នុងផ្នែកផលិតផលខាងលើ។"),
        t("We offer secure payments via ABA, ACLEDA, and Wing Bank with KHQR scanning.", "យើងផ្តល់ការទូទាត់ដោយសុវត្ថិភាពតាម ABA, ACLEDA, និង Wing Bank ជាមួយការស្កេន KHQR។"),
        t("Orders are typically processed within 24 hours. You'll receive your product automatically!", "ការកម្មង់ត្រូវបានដំណើរការជាធម្មតាក្នុងរយៈពេល 24 ម៉ោង។ អ្នកនឹងទទួលបានផលិតផលរបស់អ្នកដោយស្វ័យប្រវត្តិ!"),
        t("For immediate help, please contact our admin on Telegram: @makaraadmin", "សម្រាប់ជំនួយបន្ទាន់ សូមទាក់ទងអេតមីនរបស់យើងតាម Telegram: @makaraadmin"),
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-white/10 border border-white/20 text-white rotate-90"
            : "bg-gradient-to-br from-[#E5B75C] to-[#00D4C8] text-[#0A1628] hover:scale-110 hover:shadow-xl hover:shadow-[#E5B75C]/20"
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[520px] bg-[#0A1628] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-gradient-to-r from-[#E5B75C]/10 to-transparent">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E5B75C] to-[#00D4C8] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#0A1628]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">{t("AI Assistant", "អ្នកជំនួយការ AI")}</h4>
              <p className="text-white/40 text-xs">{t("Online", "រួមតភ្ជាប់")}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-[#E5B75C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#E5B75C]" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#E5B75C] text-[#0A1628] rounded-br-sm"
                      : "bg-white/5 text-white/80 rounded-bl-sm border border-white/5"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#00D4C8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#00D4C8]" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-[#E5B75C]/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#E5B75C]" />
                </div>
                <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("Type a message...", "វាយសារ...")}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#E5B75C]/30 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="p-2.5 rounded-lg bg-[#E5B75C] text-[#0A1628] hover:bg-[#F0C975] disabled:opacity-40 disabled:hover:bg-[#E5B75C] transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <MessageSquare className="w-3 h-3 text-white/20" />
              <a
                href="https://t.me/makaraadmin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00D4C8]/60 text-xs hover:text-[#00D4C8] transition-colors"
              >
                {t("Contact Live Admin", "ទាក់ទងអេតមីនផ្ទាល់")}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
