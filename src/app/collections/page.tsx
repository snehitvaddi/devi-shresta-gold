import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import CategoryShowcase from "@/components/CategoryShowcase";
import { getOrgData, getCurrentOrgId } from "@/lib/data/org";
import { getProducts } from "@/lib/data/products";

export async function generateMetadata(): Promise<Metadata> {
  const orgData = await getOrgData(getCurrentOrgId());
  return {
    title: "Collections",
    description: `Explore our curated collection of fine jewelry at ${orgData.name}. Gold necklaces, diamond rings, bridal sets, temple jewelry & more.`,
  };
}

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const orgId = getCurrentOrgId();
  const [orgData, products, params] = await Promise.all([
    getOrgData(orgId),
    getProducts(orgId),
    searchParams,
  ]);

  const selectedCategory = params.category;

  // Build category objects with name + slug for ProductGrid
  const categories = orgData.categories.map((c) => ({
    name: c.name,
    slug: c.id,
  }));

  return (
    <div className="pt-24 pb-8">
      {/* Page Header */}
      <div className="container-site text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold text-gradient mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {selectedCategory
            ? orgData.categories.find((c) => c.slug === selectedCategory)?.name || "Our Collections"
            : "Our Collections"}
        </h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto mb-6">
          {selectedCategory
            ? orgData.categories.find((c) => c.slug === selectedCategory)?.description ||
              "Discover handcrafted pieces that tell your story."
            : "Discover handcrafted pieces that tell your story. Each creation is a testament to the art of fine jewelry making."}
        </p>
        <div className="divider max-w-xs mx-auto !mt-0 !mb-0" />
      </div>

      {/* Category Cards — only show when no category is selected */}
      {!selectedCategory && <CategoryShowcase categories={orgData.categories} />}

      {/* Product Grid with Filters — pass ALL products, let ProductGrid filter by slug */}
      <ProductGrid
        key={selectedCategory || "all"}
        products={products}
        categories={categories}
        showFilters
        showTitle={false}
        defaultCategory={selectedCategory}
      />
    </div>
  );
}
