/**
 * Instagram public profile scraper
 *
 * Fetches public profile data and recent posts.
 * Uses Instagram's public API / web scraping approach.
 *
 * NOTE: Instagram's anti-scraping measures are aggressive. For production
 * use, integrate with the official Instagram Graph API via a Facebook App.
 * This module provides the interface and a basic implementation.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface InstagramProfile {
  username: string;
  fullName: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  profilePicUrl: string;
  isVerified: boolean;
  externalUrl?: string;
}

export interface InstagramPost {
  id: string;
  shortcode: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  timestamp: number;
  isVideo: boolean;
  videoUrl?: string;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch a public Instagram profile.
 *
 * For production: use Instagram Graph API with INSTAGRAM_ACCESS_TOKEN.
 * This implementation attempts the public JSON endpoint as a fallback.
 */
export async function getPublicProfile(
  username: string
): Promise<InstagramProfile> {
  // Try Instagram Graph API first if token is available
  const graphToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (graphToken) {
    return getProfileViaGraphAPI(username, graphToken);
  }

  // Fallback: public web endpoint
  return getProfileViaWeb(username);
}

/**
 * Fetch recent posts from a public Instagram profile.
 */
export async function getRecentPosts(
  username: string,
  count: number = 12
): Promise<InstagramPost[]> {
  const graphToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (graphToken) {
    return getPostsViaGraphAPI(username, count, graphToken);
  }

  return getPostsViaWeb(username, count);
}

// ── Graph API implementations ───────────────────────────────────────────────

const GRAPH_API_BASE = "https://graph.instagram.com/v21.0";

async function getProfileViaGraphAPI(
  username: string,
  token: string
): Promise<InstagramProfile> {
  // The Graph API requires a user ID; for business discovery we need a business account
  const url = new URL(`${GRAPH_API_BASE}/me`);
  url.searchParams.set(
    "fields",
    `business_discovery.username(${username}){username,name,biography,followers_count,follows_count,media_count,profile_picture_url,ig_id}`
  );
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Instagram Graph API error: ${res.status}`);
  }

  const data = await res.json();
  const profile = data.business_discovery;

  if (!profile) {
    throw new Error(`Profile not found: ${username}`);
  }

  return {
    username: profile.username,
    fullName: profile.name ?? "",
    bio: profile.biography ?? "",
    followerCount: profile.followers_count ?? 0,
    followingCount: profile.follows_count ?? 0,
    postCount: profile.media_count ?? 0,
    profilePicUrl: profile.profile_picture_url ?? "",
    isVerified: false, // Not available via basic Graph API
    externalUrl: undefined,
  };
}

async function getPostsViaGraphAPI(
  username: string,
  count: number,
  token: string
): Promise<InstagramPost[]> {
  const url = new URL(`${GRAPH_API_BASE}/me`);
  url.searchParams.set(
    "fields",
    `business_discovery.username(${username}){media.limit(${count}){id,caption,media_url,thumbnail_url,timestamp,like_count,comments_count,media_type,permalink}}`
  );
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Instagram Graph API error: ${res.status}`);
  }

  const data = await res.json();
  const media = data.business_discovery?.media?.data ?? [];

  return media.map(
    (m: {
      id: string;
      permalink?: string;
      media_url?: string;
      thumbnail_url?: string;
      caption?: string;
      like_count?: number;
      comments_count?: number;
      timestamp?: string;
      media_type?: string;
    }) => ({
      id: m.id,
      shortcode: m.permalink?.split("/p/")?.[1]?.replace("/", "") ?? m.id,
      imageUrl: m.media_url ?? "",
      thumbnailUrl: m.thumbnail_url ?? m.media_url ?? "",
      caption: m.caption ?? "",
      likeCount: m.like_count ?? 0,
      commentCount: m.comments_count ?? 0,
      timestamp: m.timestamp ? new Date(m.timestamp).getTime() : 0,
      isVideo: m.media_type === "VIDEO",
      videoUrl: m.media_type === "VIDEO" ? m.media_url : undefined,
    })
  );
}

// ── Web scraping fallback ───────────────────────────────────────────────────

async function getProfileViaWeb(
  username: string
): Promise<InstagramProfile> {
  const res = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "X-IG-App-ID": "936619743392459",
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `Instagram profile fetch failed: ${res.status}. Consider using the Graph API.`
    );
  }

  const data = await res.json();
  const user = data?.data?.user;

  if (!user) {
    throw new Error(`Profile not found: ${username}`);
  }

  return {
    username: user.username,
    fullName: user.full_name ?? "",
    bio: user.biography ?? "",
    followerCount: user.edge_followed_by?.count ?? 0,
    followingCount: user.edge_follow?.count ?? 0,
    postCount: user.edge_owner_to_timeline_media?.count ?? 0,
    profilePicUrl: user.profile_pic_url_hd ?? user.profile_pic_url ?? "",
    isVerified: user.is_verified ?? false,
    externalUrl: user.external_url,
  };
}

async function getPostsViaWeb(
  username: string,
  count: number
): Promise<InstagramPost[]> {
  // The web profile info endpoint includes recent media edges
  const res = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "X-IG-App-ID": "936619743392459",
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `Instagram posts fetch failed: ${res.status}. Consider using the Graph API.`
    );
  }

  const data = await res.json();
  const edges =
    data?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];

  return edges.slice(0, count).map(
    (edge: {
      node: {
        id: string;
        shortcode: string;
        display_url: string;
        thumbnail_src: string;
        edge_media_to_caption?: { edges: { node: { text: string } }[] };
        edge_liked_by?: { count: number };
        edge_media_to_comment?: { count: number };
        taken_at_timestamp: number;
        is_video: boolean;
        video_url?: string;
      };
    }) => {
      const n = edge.node;
      return {
        id: n.id,
        shortcode: n.shortcode,
        imageUrl: n.display_url,
        thumbnailUrl: n.thumbnail_src ?? n.display_url,
        caption:
          n.edge_media_to_caption?.edges?.[0]?.node?.text ?? "",
        likeCount: n.edge_liked_by?.count ?? 0,
        commentCount: n.edge_media_to_comment?.count ?? 0,
        timestamp: n.taken_at_timestamp * 1000,
        isVideo: n.is_video,
        videoUrl: n.is_video ? n.video_url : undefined,
      } satisfies InstagramPost;
    }
  );
}
