import { NextResponse } from "next/server";

/**
 * Instagram Feed API
 *
 * Supports two modes:
 *
 * 1. **Instagram Graph API** (recommended for production):
 *    Set INSTAGRAM_ACCESS_TOKEN in env. Get it from:
 *    https://developers.facebook.com/docs/instagram-basic-display-api/
 *    Returns real posts with images, captions, timestamps.
 *
 * 2. **Public profile scrape** (fallback, no auth needed):
 *    Fetches the public profile page and extracts recent post shortcodes.
 *    Less reliable but works without any setup.
 */

interface InstagramPost {
  id: string;
  caption: string;
  postUrl: string;
  shortcode: string;
  type: "image" | "video" | "reel";
  imageUrl: string;
  timestamp?: string;
}

// Cache posts for 1 hour to avoid rate limiting
let cachedPosts: InstagramPost[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const INSTAGRAM_HANDLE = "devishrestagoldanddiamonds";

async function fetchViaGraphAPI(token: string): Promise<InstagramPost[]> {
  // Instagram Graph API — fetch user's recent media
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=8&access_token=${token}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error("Instagram Graph API error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return (data.data || []).map(
    (post: {
      id: string;
      caption?: string;
      media_type: string;
      media_url?: string;
      permalink: string;
      thumbnail_url?: string;
      timestamp: string;
    }) => {
      const shortcodeMatch = post.permalink.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
      return {
        id: post.id,
        caption: post.caption || "",
        postUrl: post.permalink,
        shortcode: shortcodeMatch ? shortcodeMatch[2] : post.id,
        type:
          post.media_type === "VIDEO"
            ? "reel"
            : ("image" as "image" | "video" | "reel"),
        imageUrl: post.thumbnail_url || post.media_url || "",
        timestamp: post.timestamp,
      };
    }
  );
}

async function fetchViaPublicProfile(): Promise<InstagramPost[]> {
  // Fetch the public Instagram profile page and extract post shortcodes
  // This uses Instagram's web interface which returns post data in the HTML
  try {
    const res = await fetch(
      `https://www.instagram.com/${INSTAGRAM_HANDLE}/`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const html = await res.text();

    // Extract shortcodes from the HTML — Instagram embeds post links in the page
    const shortcodeRegex =
      /\/(p|reel)\/([A-Za-z0-9_-]{6,})\//g;
    const found = new Set<string>();
    const posts: InstagramPost[] = [];
    let match;

    while ((match = shortcodeRegex.exec(html)) !== null) {
      const type = match[1] as "p" | "reel";
      const shortcode = match[2];
      if (!found.has(shortcode)) {
        found.add(shortcode);
        posts.push({
          id: shortcode,
          caption: "",
          postUrl: `https://www.instagram.com/${type === "reel" ? "reel" : "p"}/${shortcode}/`,
          shortcode,
          type: type === "reel" ? "reel" : "image",
          imageUrl: "",
        });
      }
      if (posts.length >= 8) break;
    }

    return posts;
  } catch (err) {
    console.error("Instagram public scrape error:", err);
    return [];
  }
}

// Hardcoded fallback — known real posts from @devishrestagoldanddiamonds
const FALLBACK_POSTS: InstagramPost[] = [
  {
    id: "1",
    caption:
      "We're Going Bigger, Brighter, and Grander... Stay tuned for something extraordinary!",
    postUrl:
      "https://www.instagram.com/devishrestagoldanddiamonds/reel/DJlsEO_suSj/",
    shortcode: "DJlsEO_suSj",
    type: "reel",
    imageUrl: "",
  },
  {
    id: "2",
    caption:
      "Wear Your Culture with a Modern Statement. Traditional meets contemporary.",
    postUrl:
      "https://www.instagram.com/devishrestagoldanddiamonds/reel/DC7Drrfh9ls/",
    shortcode: "DC7Drrfh9ls",
    type: "reel",
    imageUrl: "",
  },
  {
    id: "3",
    caption:
      "This exquisite haram from Devi Shresta Gold & Diamonds is a masterpiece of traditional craftsmanship.",
    postUrl:
      "https://www.instagram.com/devishrestagoldanddiamonds/reel/DG4u3FTzv_W/",
    shortcode: "DG4u3FTzv_W",
    type: "reel",
    imageUrl: "",
  },
  {
    id: "4",
    caption:
      "All new Black Diamond collection — Bold, Beautiful, and Breathtaking.",
    postUrl:
      "https://www.instagram.com/devishrestagoldanddiamonds/reel/C-xQLpSvF3i/",
    shortcode: "C-xQLpSvF3i",
    type: "reel",
    imageUrl: "",
  },
];

export async function GET() {
  // Return cached posts if still fresh
  if (cachedPosts && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return NextResponse.json({
      posts: cachedPosts,
      source: "cache",
      handle: INSTAGRAM_HANDLE,
    });
  }

  let posts: InstagramPost[] = [];
  let source = "fallback";

  // Try Graph API first (if token is configured)
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (token) {
    posts = await fetchViaGraphAPI(token);
    if (posts.length > 0) source = "graph_api";
  }

  // Try public profile scrape as fallback
  if (posts.length === 0) {
    posts = await fetchViaPublicProfile();
    if (posts.length > 0) source = "public_scrape";
  }

  // Use hardcoded fallback as last resort
  if (posts.length === 0) {
    posts = FALLBACK_POSTS;
    source = "fallback";
  }

  // Cache the result
  cachedPosts = posts;
  cacheTimestamp = Date.now();

  return NextResponse.json({
    posts,
    source,
    handle: INSTAGRAM_HANDLE,
    cachedAt: new Date().toISOString(),
  });
}
