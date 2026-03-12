import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '@/types';

const ORGS_DIR = path.join(process.cwd(), 'orgs');

function productsPath(orgId: string): string {
  return path.join(ORGS_DIR, orgId, 'products.json');
}

async function readProducts(orgId: string): Promise<Product[]> {
  try {
    const raw = await fs.readFile(productsPath(orgId), 'utf-8');
    const parsed = JSON.parse(raw);
    // Handle both { products: [...] } wrapper and plain array
    return Array.isArray(parsed) ? parsed : (parsed.products ?? []);
  } catch {
    return [];
  }
}

async function writeProducts(orgId: string, products: Product[]): Promise<void> {
  const filePath = productsPath(orgId);
  let output: unknown = products;
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) && typeof parsed === 'object' && parsed !== null) {
      // Preserve the original wrapper structure (e.g. categories array)
      output = { ...parsed, products };
    }
  } catch {
    // File doesn't exist yet or is invalid — write plain array
  }
  await fs.writeFile(filePath, JSON.stringify(output, null, 2), 'utf-8');
}

export async function getProducts(orgId: string): Promise<Product[]> {
  return readProducts(orgId);
}

export async function getProductById(orgId: string, productId: string): Promise<Product | null> {
  const products = await readProducts(orgId);
  return products.find((p) => p.id === productId) ?? null;
}

export async function getProductsByCategory(orgId: string, category: string): Promise<Product[]> {
  const products = await readProducts(orgId);
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export async function getFeaturedProducts(orgId: string): Promise<Product[]> {
  const products = await readProducts(orgId);
  return products.filter((p) => p.featured);
}

export async function searchProducts(orgId: string, query: string): Promise<Product[]> {
  const products = await readProducts(orgId);
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  );
}

export async function addProduct(orgId: string, product: Product): Promise<Product> {
  const products = await readProducts(orgId);
  products.push(product);
  await writeProducts(orgId, products);
  return product;
}

export async function updateProduct(
  orgId: string,
  productId: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const products = await readProducts(orgId);
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  await writeProducts(orgId, products);
  return products[index];
}

export async function deleteProduct(orgId: string, productId: string): Promise<boolean> {
  const products = await readProducts(orgId);
  const filtered = products.filter((p) => p.id !== productId);
  if (filtered.length === products.length) return false;
  await writeProducts(orgId, filtered);
  return true;
}
