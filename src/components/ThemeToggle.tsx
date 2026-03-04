"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "relative w-14 h-7 rounded-full transition-colors duration-300",
        theme === "dark"
          ? "bg-[var(--color-bg-surface-light)] border border-[var(--color-text)]/10"
          : "bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/20",
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Track icons */}
      <Moon
        size={12}
        className={cn(
          "absolute left-1.5 top-1/2 -translate-y-1/2 transition-opacity",
          theme === "dark" ? "opacity-60 text-[var(--color-primary)]" : "opacity-20"
        )}
      />
      <Sun
        size={12}
        className={cn(
          "absolute right-1.5 top-1/2 -translate-y-1/2 transition-opacity",
          theme === "light" ? "opacity-80 text-[var(--color-primary)]" : "opacity-20"
        )}
      />

      {/* Thumb */}
      <span
        className={cn(
          "absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300",
          "flex items-center justify-center",
          theme === "dark"
            ? "left-0.5 bg-[var(--color-bg)] border border-[var(--color-text)]/10"
            : "left-[calc(100%-1.625rem)] bg-white border border-[var(--color-primary)]/20",
        )}
      >
        {theme === "dark" ? (
          <Moon size={12} className="text-[var(--color-primary)]" />
        ) : (
          <Sun size={12} className="text-[var(--color-primary)]" />
        )}
      </span>
    </button>
  );
}
