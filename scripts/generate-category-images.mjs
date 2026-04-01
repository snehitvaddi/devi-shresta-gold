#!/usr/bin/env node
/**
 * Generate remaining category banner images for consistency.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(ROOT, 'public/images/categories');

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_TOKEN) {
  console.error('Error: Set REPLICATE_API_TOKEN environment variable');
  process.exit(1);
}
const MODEL_VERSION = '712e06a8e122fb7c8dae55dcf7ad6a8e717afb7b1c41c889fc8c5132fd42f374';

const STYLE = 'Professional Indian jewelry catalog photograph, close-up of jewelry pieces only arranged on dark navy velvet display, warm studio lighting with soft golden reflections, South Indian traditional gold jewelry, ultra realistic, high detail, elegant and luxurious, no people no faces, dark background with bokeh';

const categories = [
  { slug: 'necklaces', filename: 'cat-necklaces.jpg', prompt: `Collection of traditional South Indian 22K gold necklaces displayed together including temple necklace, choker, and haarams with rubies and emeralds, ${STYLE}` },
  { slug: 'bangles', filename: 'cat-bangles.jpg', prompt: `Set of ornate 22K gold bangles and bracelets with floral engravings and kemp stones arranged on display, traditional Indian gold bangles, ${STYLE}` },
  { slug: 'rings', filename: 'cat-rings.jpg', prompt: `Collection of gold and diamond rings including engagement solitaire, wedding bands, and fashion rings in 22K gold and 18K white gold, ${STYLE}` },
  { slug: 'pendants', filename: 'cat-pendants.jpg', prompt: `Gold chains and diamond pendants arranged on velvet display, including delicate 18K gold chain with diamond pendant and traditional gold mangalsutra, ${STYLE}` },
  { slug: 'bridal', filename: 'cat-bridal.jpg', prompt: `Complete Indian bridal gold jewelry set laid out on dark velvet — choker necklace, long haarams, jhumka earrings, maang tikka, and bangles, elaborate 22K gold with diamonds and kundan, ${STYLE}` },
  { slug: 'temple', filename: 'cat-temple.jpg', prompt: `Traditional South Indian temple jewelry collection including Lakshmi necklace, peacock choker, and kemp stone pieces in antique gold finish with rubies emeralds, ${STYLE}` },
];

async function createPrediction(prompt) {
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version: MODEL_VERSION,
      input: { prompt, aspect_ratio: '3:4', resolution: '1K', output_format: 'jpg', safety_filter_level: 'block_only_high' },
    }),
  });
  if (!res.ok) throw new Error(`Create failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function poll(id) {
  while (true) {
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await res.json();
    if (data.status === 'succeeded') return data.output;
    if (data.status === 'failed' || data.status === 'canceled') throw new Error(`${id} ${data.status}: ${data.error}`);
    await new Promise(r => setTimeout(r, 3000));
  }
}

async function download(url, dest) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(DEST, { recursive: true });
  console.log(`Generating ${categories.length} category banners...\n`);

  const jobs = [];
  for (const cat of categories) {
    const pred = await createPrediction(cat.prompt);
    jobs.push({ ...cat, predictionId: pred.id });
    console.log(`  Queued: ${cat.filename} (${pred.id})`);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nWaiting for ${jobs.length} images...\n`);

  const results = await Promise.allSettled(jobs.map(async (job) => {
    const url = await poll(job.predictionId);
    const bytes = await download(url, path.join(DEST, job.filename));
    console.log(`  Downloaded: ${job.filename} (${(bytes/1024).toFixed(0)}KB)`);
    return job;
  }));

  const ok = results.filter(r => r.status === 'fulfilled').length;
  const fail = results.filter(r => r.status === 'rejected');
  console.log(`\nDone: ${ok} succeeded, ${fail.length} failed`);
  fail.forEach(f => console.log(`  FAILED: ${f.reason?.message}`));
}

main().catch(e => { console.error(e); process.exit(1); });
