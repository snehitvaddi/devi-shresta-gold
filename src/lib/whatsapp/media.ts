/**
 * WhatsApp media handling – download, upload, and URL retrieval
 */

const WHATSAPP_API_BASE = "https://graph.facebook.com/v21.0";

function getAccessToken(): string {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) throw new Error("Missing WHATSAPP_ACCESS_TOKEN");
  return token;
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface MediaInfo {
  url: string;
  mime_type: string;
  sha256: string;
  file_size: number;
  id: string;
}

export interface UploadResult {
  publicUrl: string;
  path: string;
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Get the temporary download URL for a WhatsApp media ID */
export async function getMediaUrl(mediaId: string): Promise<MediaInfo> {
  const token = getAccessToken();
  const res = await fetch(`${WHATSAPP_API_BASE}/${mediaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to get media URL: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<MediaInfo>;
}

/** Download media content from WhatsApp servers as a Buffer */
export async function downloadWhatsAppMedia(
  mediaId: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  const info = await getMediaUrl(mediaId);
  const token = getAccessToken();

  const res = await fetch(info.url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to download media: ${res.status} ${res.statusText}`
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType: info.mime_type,
  };
}

/**
 * Upload a buffer to Supabase Storage.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 * The bucket "media" must exist in your Supabase project.
 */
export async function uploadToStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string = "image/jpeg",
  bucket: string = "media"
): Promise<UploadResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  const path = `uploads/${Date.now()}-${filename}`;
  const url = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": mimeType,
      "x-upsert": "true",
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storage upload failed: ${res.status} – ${text}`);
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  return { publicUrl, path };
}

/** Convenience: download from WhatsApp and re-upload to Supabase */
export async function transferMedia(
  mediaId: string,
  filename?: string
): Promise<UploadResult> {
  const { buffer, mimeType } = await downloadWhatsAppMedia(mediaId);
  const ext = mimeType.split("/")[1] ?? "bin";
  const name = filename ?? `wa-media-${mediaId}.${ext}`;
  return uploadToStorage(buffer, name, mimeType);
}
