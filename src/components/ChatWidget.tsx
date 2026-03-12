"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Sparkles, User, Phone, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  products?: { name: string; price: number; slug: string }[];
}

interface LeadInfo {
  name: string;
  phone: string;
  email: string;
}

type ChatStep = "closed" | "lead-capture" | "chatting";

interface ChatWidgetProps {
  businessName?: string;
}

export default function ChatWidget({ businessName = "Devi Shresta Gold & Diamonds" }: ChatWidgetProps) {
  const [step, setStep] = useState<ChatStep>("closed");
  const [lead, setLead] = useState<LeadInfo>({ name: "", phone: "", email: "" });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (step === "chatting") {
      inputRef.current?.focus();
    } else if (step === "lead-capture") {
      // Small delay to let animation finish
      setTimeout(() => phoneInputRef.current?.focus(), 300);
    }
  }, [step]);

  // Listen for "open-chat" events from other components (e.g., "Enquire Now" buttons)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) {
        setPendingMessage(detail.message);
      }
      if (step === "closed") {
        setStep("lead-capture");
      } else if (step === "chatting" && detail?.message) {
        // Already chatting, send the message directly
        sendMessageDirect(detail.message);
      }
    };
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const openChat = () => {
    if (step === "closed") {
      setStep("lead-capture");
    } else {
      setStep("closed");
    }
    setUnread(0);
  };

  const startChat = () => {
    if (!lead.name.trim() || !lead.phone.trim()) return;

    // Initialize with welcome message personalized to the user
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hi ${lead.name.split(" ")[0]}! 👋 Welcome to ${businessName}. I'm your AI concierge — I can help you find jewelry, check prices, book a visit, or answer any questions. What are you looking for today?`,
        timestamp: new Date(),
      },
    ]);

    setStep("chatting");

    // If there was a pending message from "Enquire Now", send it
    if (pendingMessage) {
      setTimeout(() => {
        sendMessageDirect(pendingMessage!);
        setPendingMessage(null);
      }, 500);
    }
  };

  const sendMessageDirect = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lead: { name: lead.name, phone: lead.phone, email: lead.email },
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || data.text || "I apologize, I encountered an issue. Please try again.",
        timestamp: new Date(),
        products: data.suggestedProducts,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If handover triggered, show system message
      if (data.handover) {
        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            role: "system",
            content: `I've notified our team about your request. Someone from ${businessName} will reach out to you on ${lead.phone} shortly. You can also WhatsApp us directly for faster response.`,
            timestamp: new Date(),
          },
        ]);
      }

      if (step !== "chatting") setUnread((u) => u + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I'm unable to respond right now. Please WhatsApp us directly for immediate help.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    await sendMessageDirect(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (step === "lead-capture") {
        startChat();
      } else {
        sendMessage();
      }
    }
  };

  const isOpen = step !== "closed";

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-40 right-6 z-50",
          "w-[380px] max-w-[calc(100vw-2rem)]",
          "bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)]",
          "border border-[var(--color-text)]/10 shadow-2xl",
          "flex flex-col overflow-hidden",
          "transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{ height: step === "lead-capture" ? "auto" : "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[var(--color-bg-surface-light)] to-[var(--color-bg-surface)] border-b border-[var(--color-text)]/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
              <Sparkles size={16} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <span
                className="font-semibold text-sm text-[var(--color-text)] block leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                AI Concierge
              </span>
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online now
              </span>
            </div>
          </div>
          <button
            onClick={() => setStep("closed")}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── STEP 1: Lead Capture Form ── */}
        {step === "lead-capture" && (
          <div className="p-5">
            {/* Greeting */}
            <div className="bg-[var(--color-bg-surface-light)] rounded-2xl rounded-bl-md px-4 py-3 mb-5">
              <p className="text-sm text-[var(--color-text)] leading-relaxed">
                Hi there! 👋 Before we chat, could you share your details so our team can assist you better?
              </p>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={lead.name}
                  onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                  className="w-full bg-[var(--color-bg)] text-[var(--color-text)] text-sm rounded-lg pl-10 pr-4 py-2.5 border border-[var(--color-text)]/10 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="Phone Number * (WhatsApp preferred)"
                  value={lead.phone}
                  onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))}
                  className="w-full bg-[var(--color-bg)] text-[var(--color-text)] text-sm rounded-lg pl-10 pr-4 py-2.5 border border-[var(--color-text)]/10 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={lead.email}
                  onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                  className="w-full bg-[var(--color-bg)] text-[var(--color-text)] text-sm rounded-lg pl-10 pr-4 py-2.5 border border-[var(--color-text)]/10 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Start Chat Button */}
            <button
              onClick={startChat}
              disabled={!lead.name.trim() || !lead.phone.trim()}
              className={cn(
                "w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all",
                lead.name.trim() && lead.phone.trim()
                  ? "bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-dark)]"
                  : "bg-[var(--color-bg-surface-light)] text-[var(--color-text-muted)] cursor-not-allowed"
              )}
            >
              Start Chatting
              <ArrowRight size={16} />
            </button>

            {/* Privacy note */}
            <div className="flex items-center gap-1.5 mt-3 justify-center">
              <ShieldCheck size={12} className="text-green-400" />
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Your info is private and only shared with {businessName} team
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 2: Chat Interface ── */}
        {step === "chatting" && (
          <>
            {/* Lead info bar */}
            <div className="px-4 py-1.5 bg-[var(--color-primary)]/5 border-b border-[var(--color-primary)]/10 flex items-center justify-between">
              <span className="text-[10px] text-[var(--color-text-muted)]">
                Chatting as <strong className="text-[var(--color-primary)]">{lead.name}</strong>
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)]">
                {lead.phone}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {/* System messages */}
                  {msg.role === "system" && (
                    <div className="flex justify-center my-2">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 max-w-[90%]">
                        <p className="text-xs text-green-400 text-center">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* User / Assistant messages */}
                  {msg.role !== "system" && (
                    <div
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-[var(--color-primary)] text-[var(--color-text-dark)] rounded-br-md"
                            : "bg-[var(--color-bg-surface-light)] text-[var(--color-text)] rounded-bl-md"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  )}

                  {/* Product suggestions */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1 pl-2">
                      {msg.products.map((p, i) => (
                        <a
                          key={i}
                          href={`/collections/${p.slug}`}
                          className="shrink-0 bg-[var(--color-bg)] border border-[var(--color-primary)]/20 rounded-lg px-3 py-2 hover:border-[var(--color-primary)]/50 transition-colors"
                        >
                          <p className="text-xs font-semibold text-[var(--color-text)] whitespace-nowrap">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-[var(--color-primary)]">
                            ₹{p.price?.toLocaleString("en-IN")}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--color-bg-surface-light)] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[var(--color-text)]/5">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about jewelry, prices, bookings..."
                  className="flex-1 bg-[var(--color-bg)] text-[var(--color-text)] text-sm rounded-full px-4 py-2.5 border border-[var(--color-text)]/10 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all",
                    input.trim()
                      ? "bg-[var(--color-primary)] text-[var(--color-text-dark)]"
                      : "bg-[var(--color-bg-surface-light)] text-[var(--color-text-muted)]"
                  )}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[9px] text-[var(--color-text-muted)] text-center mt-1.5">
                Powered by AI · Our team may follow up via WhatsApp
              </p>
            </div>
          </>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={openChat}
        className={cn(
          "fixed bottom-24 right-6 z-50",
          "w-14 h-14 rounded-full",
          "bg-[var(--color-primary)] text-[var(--color-text-dark)]",
          "shadow-lg hover:shadow-[var(--shadow-gold)]",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          isOpen && "opacity-0 pointer-events-none"
        )}
        aria-label="Open chat"
      >
        <MessageSquare size={24} />

        {/* Unread badge */}
        {unread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-error)] text-white text-xs flex items-center justify-center font-semibold">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
