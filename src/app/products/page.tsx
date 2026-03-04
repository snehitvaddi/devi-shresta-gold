import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import { getOrgData, getCurrentOrgId } from "@/lib/data/org";
import { getProducts } from "@/lib/data/products";

export async function generateMetadata(): Promise<Metadata> {
  const orgData = await getOrgData(getCurrentOrgId());
  return {
    title: "Our Collections",
    description: `Explore the complete collection of gold and diamond jewelry at ${orgData.name}. From traditional designs to modern pieces, find your perfect jewelry.`,
    openGraph: {
      title: `Collections | ${orgData.name}`,
      description: `Browse our full catalog of handcrafted gold and diamond jewelry.`,
    },
  };
}

export default async function ProductsPage() {
  const orgId = getCurrentOrgId();
  const [orgData, products] = await Promise.all([
    getOrgData(orgId),
    getProducts(orgId),
  ]);

  const categories = orgData.categories.map((c) => ({
    name: c.name,
    slug: c.id,
  }));

  return (
    <div className="pt-24 pb-8">
      {/* Page Header */}
      <div className="container-site text-center mb-4">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="block w-12 h-px bg-[var(--color-primary)]" />
          <span className="block w-2 h-2 rotate-45 border border-[var(--color-primary)]" />
          <span className="block w-12 h-px bg-[var(--color-primary)]" />
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold text-gradient mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our Collections
        </h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-lg">
          Discover exquisite handcrafted jewelry from {orgData.name}. Each piece
          tells a story of tradition, artistry, and timeless beauty.
        </p>
      </div>

      <ProductGrid
        products={products}
        categories={categories}
        showFilters
        showTitle={false}
      />
    </div>
  );
}
