#!/usr/bin/env node
/**
 * Generate realistic jewelry product images via Replicate (Nano Banana Pro)
 * and update products.json + component files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'orgs/davis-resta/images');
const PRODUCTS_FILE = path.join(ROOT, 'orgs/davis-resta/products.json');

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_TOKEN) {
  console.error('Error: Set REPLICATE_API_TOKEN environment variable');
  process.exit(1);
}
const MODEL_VERSION = '712e06a8e122fb7c8dae55dcf7ad6a8e717afb7b1c41c889fc8c5132fd42f374';

// Consistent base style for all product images — NO FACES, jewelry only
const BASE_STYLE = 'Professional Indian jewelry product photograph, close-up shot of jewelry only with no human faces visible, placed on dark navy velvet display cushion, warm studio lighting with soft golden reflections, traditional Indian goldsmith craftsmanship, South Indian jewelry store catalog style, shot with macro lens, ultra realistic, high detail, soft bokeh background, elegant and luxurious mood, no people no faces';

// Consistent base style for category banners — NO FACES, jewelry focus
const BANNER_STYLE = 'Professional Indian jewelry catalog banner photograph, close-up of jewelry pieces only with no human faces visible, warm studio lighting with soft golden reflections, traditional Indian gold jewelry, South Indian craftsmanship, ultra realistic, high detail, elegant and luxurious, dark background, no people no faces';

// ── PRODUCTS TO REGENERATE (BAD + worst OKAY) ──────────────────────────

const productImages = [
  // === BAD — completely wrong images ===
  { id: 'prod-001', filename: 'lakshmi-temple-necklace.jpg', prompt: `Ornate 22K gold Lakshmi temple necklace with intricate goddess Lakshmi pendant motifs, traditional South Indian temple jewelry design with rubies and emeralds, heavy gold craftsmanship, ${BASE_STYLE}` },
  { id: 'prod-002', filename: 'diamond-choker-set.jpg', prompt: `Stunning 18K white gold diamond choker necklace set with matching diamond stud earrings, VS-clarity brilliant-cut diamonds arranged in floral pattern, bridal diamond jewelry, ${BASE_STYLE}` },
  { id: 'prod-003', filename: 'gold-haarams.jpg', prompt: `Traditional 22K gold long haarams necklace with mango paisley motifs, South Indian bridal gold chain, intricate filigree work, multi-layered temple gold necklace, ${BASE_STYLE}` },
  { id: 'prod-005', filename: 'diamond-tennis-bracelet.jpg', prompt: `18K white gold diamond tennis bracelet with 2.5 carat brilliant-cut diamonds in prong setting, elegant line bracelet, sparkling diamonds on wrist display, ${BASE_STYLE}` },
  { id: 'prod-009', filename: 'diamond-cluster-ring.jpg', prompt: `18K rose gold diamond cluster flower ring, delicate floral design with pave-set brilliant diamonds forming a flower shape, feminine and elegant, ${BASE_STYLE}` },
  { id: 'prod-010', filename: 'gold-jhumka-earrings.jpg', prompt: `Traditional 22K gold jhumka earrings with intricate bead work and bell-shaped drops, South Indian temple jhumka design, ornate gold filigree, ${BASE_STYLE}` },
  { id: 'prod-024', filename: 'daily-wear-diamond-earrings.jpg', prompt: `Elegant 18K gold daily-wear diamond drop earrings with 0.20 carat diamonds, delicate and lightweight design suitable for everyday wear, small and refined, ${BASE_STYLE}` },
  { id: 'prod-014', filename: 'mangalsutra-diamond.jpg', prompt: `18K gold diamond mangalsutra with traditional black beads chain, central diamond pendant with intricate gold work, Indian married woman sacred necklace, ${BASE_STYLE}` },
  { id: 'prod-026', filename: 'diamond-solitaire-pendant.jpg', prompt: `18K gold pendant necklace with 0.40 carat diamond solitaire in classic four-prong setting, delicate gold chain, sparkling single diamond, ${BASE_STYLE}` },
  { id: 'prod-016', filename: 'diamond-bridal-necklace-set.jpg', prompt: `Magnificent 18K gold bridal necklace set with 5 carats of brilliant diamonds, elaborate Indian bridal diamond choker with matching earrings and tikka, ${BASE_STYLE}` },
  { id: 'prod-023', filename: 'maang-tikka-kundan.jpg', prompt: `22K gold kundan maang tikka headpiece with polki diamonds and colored gemstones, traditional Indian bridal forehead jewelry with pearl drops, ${BASE_STYLE}` },
  { id: 'prod-025', filename: 'gold-nose-ring.jpg', prompt: `22K gold traditional Indian nose ring (nath) with delicate pearl drops and chain, ornate South Indian bridal nose jewelry, ${BASE_STYLE}` },
  { id: 'prod-017', filename: 'temple-peacock-necklace.jpg', prompt: `22K gold temple jewelry peacock necklace with ruby and emerald stones, traditional South Indian peacock motif design, antique matte gold finish, ${BASE_STYLE}` },
  { id: 'prod-019', filename: 'mens-gold-chain-bismark.jpg', prompt: `22K gold men's bismark chain necklace, 24 inches long, thick heavy masculine gold chain with bismark link pattern, men's jewelry, ${BASE_STYLE}` },

  // === OKAY — passable but wrong style/material ===
  { id: 'prod-006', filename: 'gold-kada-antique.jpg', prompt: `22K gold antique finish kada bangle with temple motifs, traditional Indian men's gold bangle with oxidized antique patina, heavy solid gold, ${BASE_STYLE}` },
  { id: 'prod-011', filename: 'diamond-stud-earrings.jpg', prompt: `1.0 carat total diamond stud earrings in 18K white gold, classic four-prong round brilliant diamond studs, sparkling and simple, ${BASE_STYLE}` },
  { id: 'prod-012', filename: 'chandbali-earrings.jpg', prompt: `22K gold chandbali earrings with pearl drops and meenakari enamel work, crescent moon shaped traditional Hyderabadi chandbali design, colorful enamel on gold, ${BASE_STYLE}` },
  { id: 'prod-018', filename: 'temple-kemp-choker.jpg', prompt: `22K gold temple choker necklace with red kemp stones and central Lakshmi pendant, traditional South Indian temple jewelry, antique finish, ${BASE_STYLE}` },
  { id: 'prod-029', filename: 'mens-gold-bracelet.jpg', prompt: `22K gold men's heavy link bracelet, thick masculine chain bracelet with solid gold links, bold and substantial men's jewelry, ${BASE_STYLE}` },
  { id: 'prod-021', filename: 'lakshmi-gold-coin-10g.jpg', prompt: `24K pure gold Lakshmi coin, 10 grams, BIS hallmarked, embossed goddess Lakshmi design on front, gleaming pure gold coin, ${BASE_STYLE}` },
  { id: 'prod-030', filename: 'lakshmi-gold-coin-5g.jpg', prompt: `24K pure gold Lakshmi coin, 5 grams, small BIS hallmarked gold coin with embossed Lakshmi design, pure gold, ${BASE_STYLE}` },
];

// Category banner images to regenerate (BAD ones)
const categoryBanners = [
  { slug: 'mens', filename: 'cat-mens.jpg', prompt: `Collection of men's 22K gold jewelry including chains, rings, and bracelets displayed together, masculine gold jewelry showcase, ${BANNER_STYLE}` },
  { slug: 'coins', filename: 'cat-coins.jpg', prompt: `Collection of 24K pure gold coins and gold bars arranged on dark velvet, Lakshmi gold coins and BIS hallmarked gold bars, investment gold, ${BANNER_STYLE}` },
  { slug: 'earrings', filename: 'cat-earrings.jpg', prompt: `Collection of traditional Indian gold earrings including jhumkas and chandbali, 22K gold earrings with gemstones, South Indian jewelry, ${BANNER_STYLE}` },
];

// About/page images
const pageImages = [
  { key: 'about-hero', filename: 'about-hero.jpg', prompt: `Close-up of skilled Indian artisan hands crafting intricate 22K gold jewelry at a traditional goldsmith workbench, traditional tools and gold pieces visible, warm workshop lighting, no face visible only hands and jewelry, ${BANNER_STYLE}` },
  { key: 'workshop', filename: 'workshop.jpg', prompt: `Traditional Indian jewelry workshop interior showing gold pieces being crafted, artisan tools, magnifying loupe, gold filings on workbench, partially finished gold necklaces and bangles, warm ambient lighting, no people no faces, ${BANNER_STYLE}` },
];

// ── API HELPERS ──────────────────────────────────────────────────────────

async function createPrediction(prompt, aspectRatio = '1:1', resolution = '1K') {
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: MODEL_VERSION,
      input: {
        prompt,
        aspect_ratio: aspectRatio,
        resolution,
        output_format: 'jpg',
        safety_filter_level: 'block_only_high',
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate create failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function pollPrediction(id) {
  const url = `https://api.replicate.com/v1/predictions/${id}`;
  while (true) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await res.json();
    if (data.status === 'succeeded') return data.output;
    if (data.status === 'failed' || data.status === 'canceled') {
      throw new Error(`Prediction ${id} ${data.status}: ${data.error || 'unknown'}`);
    }
    // Wait 3s before polling again
    await new Promise(r => setTimeout(r, 3000));
  }
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

// ── MAIN ─────────────────────────────────────────────────────────────────

async function main() {
  // Ensure images directory exists
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const allJobs = [
    ...productImages.map(p => ({
      ...p,
      type: 'product',
      aspectRatio: '1:1',
      resolution: '1K',
    })),
    ...categoryBanners.map(b => ({
      ...b,
      type: 'category',
      aspectRatio: '3:4',  // vertical banner for category cards
      resolution: '1K',
    })),
    ...pageImages.map(p => ({
      ...p,
      type: 'page',
      aspectRatio: '4:3',
      resolution: '2K', // higher res for hero/about — only 2 images
    })),
  ];

  console.log(`\n🚀 Launching ${allJobs.length} image generations...\n`);

  // Fire all predictions in parallel (Replicate queues them)
  const predictions = [];
  for (const job of allJobs) {
    try {
      const pred = await createPrediction(job.prompt, job.aspectRatio, job.resolution);
      predictions.push({ ...job, predictionId: pred.id });
      console.log(`  ✓ Queued: ${job.filename} (${pred.id})`);
    } catch (err) {
      console.error(`  ✗ Failed to queue ${job.filename}: ${err.message}`);
      predictions.push({ ...job, predictionId: null, error: err.message });
    }
    // Small delay to avoid rate limiting on creation
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n⏳ Waiting for ${predictions.filter(p => p.predictionId).length} predictions to complete...\n`);

  // Poll all predictions in parallel
  const results = await Promise.allSettled(
    predictions
      .filter(p => p.predictionId)
      .map(async (job) => {
        const imageUrl = await pollPrediction(job.predictionId);
        const destPath = path.join(IMAGES_DIR, job.filename);
        const bytes = await downloadImage(imageUrl, destPath);
        console.log(`  ✓ Downloaded: ${job.filename} (${(bytes / 1024).toFixed(0)}KB)`);
        return { ...job, localPath: `/orgs/davis-resta/images/${job.filename}`, success: true };
      })
  );

  // Collect successful results
  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
  const failed = results
    .filter(r => r.status === 'rejected')
    .map((r, i) => ({ ...predictions.filter(p => p.predictionId)[i], error: r.reason?.message }));

  console.log(`\n📊 Results: ${successful.length} succeeded, ${failed.length} failed`);
  if (failed.length > 0) {
    console.log('Failed:');
    failed.forEach(f => console.log(`  - ${f.filename}: ${f.error}`));
  }

  // ── UPDATE products.json ───────────────────────────────────────────
  const productsRaw = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const products = productsRaw.products || productsRaw;

  for (const result of successful.filter(r => r.type === 'product')) {
    const product = products.find(p => p.id === result.id);
    if (product && product.images && product.images[0]) {
      product.images[0].url = result.localPath;
      console.log(`  ✓ Updated ${result.id} image → ${result.localPath}`);
    }
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsRaw, null, 2) + '\n');
  console.log('\n✅ products.json updated');

  // Write a manifest for the component updates
  const manifest = {
    products: successful.filter(r => r.type === 'product').map(r => ({ id: r.id, path: r.localPath })),
    categories: successful.filter(r => r.type === 'category').map(r => ({ slug: r.slug, path: r.localPath })),
    pages: successful.filter(r => r.type === 'page').map(r => ({ key: r.key, path: r.localPath })),
    generated: new Date().toISOString(),
    total: successful.length,
    failed: failed.length,
  };
  fs.writeFileSync(path.join(IMAGES_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('✅ manifest.json written');

  console.log('\n🎉 Done! Now update CategoryShowcase.tsx, AboutSnippet.tsx, and about/page.tsx with local paths.\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
