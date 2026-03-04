"use client";

import { useRef, useState, useEffect } from "react";
import { Instagram, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InstaPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes?: number;
  comments?: number;
  postUrl?: string;
  type?: "image" | "video" | "reel";
  shortcode?: string;
}

interface InstagramFeedProps {
  posts: InstaPost[];
  instagramUrl: string;
  handle: string;
  followerCount?: string;
}

export default function InstagramFeed({
  posts,
  instagramUrl,
  handle,
  followerCount,
}: InstagramFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  // Load Instagram embed script
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as unknown as Record<string, unknown>).instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (posts.length === 0) return null;

  // Extract shortcodes from post URLs
  const postsWithShortcodes = posts.map((post) => {
    let shortcode = post.shortcode;
    if (!shortcode && post.postUrl) {
      const match = post.postUrl.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
      if (match) shortcode = match[2];
    }
    return { ...post, shortcode };
  });

  return (
    <section className="section overflow-hidden">
      {/* Section Header */}
      <div className="container-site mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-[var(--color-bg)] flex items-center justify-center">
                  <Instagram size={18} className="text-[var(--color-primary)]" />
                </div>
              </div>
              <div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-gradient"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  From Our Instagram
                </h2>
              </div>
            </div>
            <p className="text-[var(--color-text-muted)] max-w-lg">
              Follow us for the latest designs, behind-the-scenes craftsmanship, and exclusive offers
            </p>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all duration-300"
          >
            <Instagram size={16} />
            <span className="text-sm font-semibold">@{handle}</span>
            {followerCount && (
              <span className="text-xs opacity-70">({followerCount} followers)</span>
            )}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="divider max-w-xs" />
      </div>

      {/* Scrollable Feed with Instagram Embeds */}
      <div className="relative">
        {/* Navigation Arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--color-bg)]/90 backdrop-blur border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--color-bg)]/90 backdrop-blur border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Posts Row — Instagram embed iframes, clipped to show only the visual */}
        <div
          ref={scrollRef}
          className="flex gap-4 px-[max(1rem,calc((100vw-1200px)/2))] overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {postsWithShortcodes.map((post) => (
            <div
              key={post.id}
              className="shrink-0 w-[300px] md:w-[340px] rounded-xl overflow-hidden border border-[var(--color-text)]/5 bg-[var(--color-bg-surface)] relative group"
              style={{ height: "400px" }}
            >
              {post.shortcode ? (
                <>
                  {/* Iframe pushed up to hide the header, clipped at bottom to hide engagement UI */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <iframe
                      src={`https://www.instagram.com/${post.type === "reel" ? "reel" : "p"}/${post.shortcode}/embed/captioned/`}
                      className="w-full border-0"
                      style={{
                        height: "700px",
                        marginTop: "-64px",
                        pointerEvents: "none",
                      }}
                      loading="lazy"
                      title={post.caption.slice(0, 60)}
                    />
                  </div>

                  {/* Gradient fade at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />

                  {/* Caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <p className="text-white text-xs line-clamp-2 mb-2 opacity-90">
                      {post.caption}
                    </p>
                    <a
                      href={post.postUrl || instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--color-primary)] text-xs font-semibold hover:underline"
                    >
                      <Instagram size={12} />
                      View on Instagram
                    </a>
                  </div>

                  {/* Clickable overlay to open post */}
                  <a
                    href={post.postUrl || instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-30"
                    aria-label={`View ${post.caption.slice(0, 40)} on Instagram`}
                  />
                </>
              ) : (
                <a
                  href={post.postUrl || instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-3 h-full p-6 text-center"
                >
                  <Instagram size={32} className="text-[var(--color-primary)]" />
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">{post.caption}</p>
                  <span className="text-xs text-[var(--color-primary)] font-semibold">View on Instagram</span>
                </a>
              )}
            </div>
          ))}

          {/* "See More" card at end */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-[300px] md:w-[340px] rounded-xl border-2 border-dashed border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50 flex flex-col items-center justify-center gap-3 transition-all duration-300 group"
            style={{ height: "400px" }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[2px] group-hover:scale-110 transition-transform">
              <div className="w-full h-full rounded-full bg-[var(--color-bg)] flex items-center justify-center">
                <Instagram size={24} className="text-[var(--color-primary)]" />
              </div>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text)]">See More on Instagram</p>
            <p className="text-xs text-[var(--color-text-muted)]">@{handle}</p>
            <ArrowRight size={16} className="text-[var(--color-primary)] group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
