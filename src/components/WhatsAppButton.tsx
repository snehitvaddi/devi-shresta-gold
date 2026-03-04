"use client";

import { useState } from "react";
import { X, MessageCircle, ShoppingBag, HelpCircle, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  phoneNumber: string;
  businessName?: string;
}

const quickMessages = [
  {
    icon: ShoppingBag,
    label: "I want to see your collection",
    message: "Hi! I'd like to explore your jewelry collection. Can you share the latest designs?",
  },
  {
    icon: HelpCircle,
    label: "I have a question about a product",
    message: "Hi! I have a question about one of your products. Can you help?",
  },
  {
    icon: Calendar,
    label: "I want to book a visit",
    message: "Hi! I'd like to book a visit to your store. When would be a good time?",
  },
  {
    icon: MessageCircle,
    label: "Just want to chat",
    message: "Hi! I'm interested in Devi Shresta Gold & Diamonds. Can we chat?",
  },
];

export default function WhatsAppButton({
  phoneNumber,
  businessName = "Devi Shresta Gold & Diamonds",
}: WhatsAppButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  const openWhatsApp = (message: string) => {
    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    setExpanded(false);
  };

  return (
    <>
      {/* Expanded panel */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50",
          "w-[320px] max-w-[calc(100vw-2rem)]",
          "bg-[var(--color-bg-surface)] rounded-2xl",
          "border border-[var(--color-text)]/10 shadow-2xl",
          "overflow-hidden",
          "transition-all duration-300 origin-bottom-right",
          expanded
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header — WhatsApp green */}
        <div className="bg-[#075E54] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{businessName}</p>
                <p className="text-white/70 text-[11px]">Usually replies within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat-style greeting bubble */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-white rounded-xl rounded-tl-md p-3 shadow-sm max-w-[85%]">
            <p className="text-gray-800 text-sm leading-relaxed">
              Hi there! 👋 Welcome to {businessName}. How can we help you today?
            </p>
            <p className="text-gray-400 text-[10px] mt-1 text-right">just now</p>
          </div>
        </div>

        {/* Quick reply options */}
        <div className="px-4 pb-4 space-y-2">
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Quick message:
          </p>
          {quickMessages.map((item, i) => (
            <button
              key={i}
              onClick={() => openWhatsApp(item.message)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-text)]/5 hover:border-[#25D366]/30 hover:bg-[#25D366]/5 transition-all group text-left"
            >
              <item.icon size={16} className="text-[#25D366] shrink-0" />
              <span className="text-sm text-[var(--color-text)] flex-1">{item.label}</span>
              <ChevronRight size={14} className="text-[var(--color-text-muted)] group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>

        {/* Custom message */}
        <div className="px-4 pb-4">
          <button
            onClick={() => openWhatsApp(`Hi! I'm visiting from your website. I'd like to know more about ${businessName}.`)}
            className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#22c35e] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Open WhatsApp Chat
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-3 flex items-center justify-center gap-1">
          <span className="text-[9px] text-[var(--color-text-muted)]">
            💬 Chats go directly to the {businessName} team
          </span>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "fixed bottom-6 right-6 z-40",
          "w-14 h-14 rounded-full",
          "bg-[#25D366] hover:bg-[#22c35e]",
          "text-white shadow-lg",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "group"
        )}
        aria-label="Chat on WhatsApp"
      >
        {expanded ? (
          <X size={24} />
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}

        {/* Pulse ring */}
        {!expanded && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        )}

        {/* Tooltip */}
        {!expanded && (
          <span
            className={cn(
              "absolute right-full mr-3 top-1/2 -translate-y-1/2",
              "px-3 py-2 rounded-lg",
              "bg-white text-gray-800 text-sm font-medium whitespace-nowrap",
              "shadow-lg",
              "opacity-0 group-hover:opacity-100 pointer-events-none",
              "transition-opacity duration-200"
            )}
          >
            Chat with us 💬
          </span>
        )}
      </button>
    </>
  );
}
