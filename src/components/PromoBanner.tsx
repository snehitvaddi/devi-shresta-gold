"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Phone, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string; // e.g., "NEW", "LIMITED", "TRENDING"
  image?: string;
  gradient?: string; // CSS gradient for background
  cta: {
    type: "chat" | "whatsapp" | "book" | "link";
    label: string;
    href?: string;
  };
  highlight?: string; // e.g., "Starting ₹15,000" or "Flat 10% Off"
}

interface PromoBannerProps {
  slides: PromoSlide[];
  whatsappNumber?: string;
  autoPlayInterval?: number;
}

export default function PromoBanner({
  slides,
  whatsappNumber = "",
  autoPlayInterval = 5000,
}: PromoBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const next = useCallback(() => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, next, autoPlayInterval, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  const handleCTA = (cta: PromoSlide["cta"]) => {
    switch (cta.type) {
      case "whatsapp":
        window.open(
          `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in: ${slide.title}`)}`,
          "_blank"
        );
        break;
      case "chat":
        // Trigger the ChatWidget to open
        window.dispatchEvent(new CustomEvent("open-chat", { detail: { message: `Tell me about: ${slide.title}` } }));
        break;
      case "book":
        window.location.href = "/booking";
        break;
      case "link":
        if (cta.href) window.location.href = cta.href;
        break;
    }
  };

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: slide.gradient || "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-40" />

      {/* Content */}
      <div className="relative container-site py-5 md:py-6">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Prev arrow */}
          {slides.length > 1 && (
            <button
              onClick={prev}
              className="shrink-0 w-8 h-8 rounded-full border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Slide content */}
          <div
            key={slide.id}
            className={cn(
              "flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-8 min-w-0",
              "animate-[fadeIn_0.5s_ease-out]"
            )}
          >
            {/* Badge */}
            {slide.badge && (
              <span className="shrink-0 px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full bg-[var(--color-primary)] text-[var(--color-bg)] whitespace-nowrap">
                {slide.badge}
              </span>
            )}

            {/* Text */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h3
                  className="text-sm md:text-base font-semibold text-white truncate"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {slide.title}
                </h3>
                {slide.highlight && (
                  <span className="shrink-0 text-xs sm:text-sm font-bold text-[var(--color-primary)]">
                    {slide.highlight}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">
                {slide.subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="shrink-0 flex items-center gap-2">
              {/* Primary CTA */}
              <button
                onClick={() => handleCTA(slide.cta)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-dark)] transition-colors whitespace-nowrap"
              >
                {slide.cta.type === "chat" && <MessageCircle size={14} />}
                {slide.cta.type === "whatsapp" && <Phone size={14} />}
                {slide.cta.type === "book" && <Calendar size={14} />}
                {slide.cta.type === "link" && <ArrowRight size={14} />}
                {slide.cta.label}
              </button>

              {/* Quick WhatsApp */}
              {slide.cta.type !== "whatsapp" && whatsappNumber && (
                <button
                  onClick={() => handleCTA({ type: "whatsapp", label: "WhatsApp" })}
                  className="w-8 h-8 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                  aria-label="WhatsApp"
                >
                  <Phone size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Next arrow */}
          {slides.length > 1 && (
            <button
              onClick={next}
              className="shrink-0 w-8 h-8 rounded-full border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Progress dots */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? "right" : "left");
                  setCurrent(i);
                }}
                className="p-3"
                aria-label={`Go to slide ${i + 1}`}
              >
                <span
                  className={cn(
                    "block h-1 rounded-full transition-all duration-300",
                    i === current
                      ? "w-6 bg-[var(--color-primary)]"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
