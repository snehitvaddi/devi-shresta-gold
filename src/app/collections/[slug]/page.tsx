import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOrgData, getCurrentOrgId } from "@/lib/data/org";
import { getProducts } from "@/lib/data/products";
import ProductCard from "@/components/ProductCard";
import EMICalculator from "@/components/EMICalculator";
import PriceBreakdown from "@/components/PriceBreakdown";
import TrustBadgesBar from "@/components/TrustBadgesBar";
import type { Product } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts(getCurrentOrgId());
  return products.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const orgData = await getOrgData(getCurrentOrgId());
  return {
    title: `${product.name} | ${orgData.name}`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const orgData = await getOrgData(getCurrentOrgId());
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const trustBadges = (orgData as unknown as Record<string, unknown>).trustBadges as Array<{ icon: string; title: string; description: string }> | undefined;

  // Get related products (same category, exclude current)
  const allProducts = await getProducts(getCurrentOrgId());
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="pt-24">
      <div className="container-site">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Collections
          </Link>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-square rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-bg-surface)]">
            {primaryImage?.url ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={!primaryImage.url.includes("unsplash.com")}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">
                No Image Available
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <span className="badge mb-4 w-fit">{product.category}</span>

            <h1
              className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {product.name}
            </h1>

            <p
              className="text-lg text-[var(--color-primary)] mb-6"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              {product.shortDescription}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-[var(--color-primary)]">
                {formatPrice(product.price, product.currency)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.compareAtPrice!, product.currency)}
                </span>
              )}
            </div>

            {/* Price Breakdown */}
            <PriceBreakdown
              totalPrice={product.price}
              currency={product.currency}
              metadata={product.metadata}
            />

            {/* EMI Calculator (compact) */}
            <div className="mb-6">
              <EMICalculator
                defaultPrice={product.price}
                compact={true}
                whatsappNumber={orgData.socialLinks.whatsapp?.replace(/\D/g, '')}
              />
            </div>

            {/* Trust Badges Strip */}
            {trustBadges && <TrustBadgesBar badges={trustBadges} variant="strip" />}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8 mt-6">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  product.inStock ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]",
                )}
              />
              <span className="text-sm text-[var(--color-text-muted)]">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Metadata */}
            {Object.keys(product.metadata).length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-[var(--color-bg-surface)] rounded-[var(--radius-md)] border border-[var(--color-text)]/5">
                {Object.entries(product.metadata).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                      {key}
                    </span>
                    <p className="text-sm font-medium text-[var(--color-text)]">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking" className="btn btn-primary">
                <ShoppingBag size={18} />
                Book a Viewing
              </Link>
              <Link href="/contact" className="btn btn-outline">
                <Star size={18} />
                Inquire
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="section">
            <h2
              className="text-2xl md:text-3xl font-bold text-gradient mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
