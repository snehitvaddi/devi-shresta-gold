import { NextRequest, NextResponse } from "next/server";
import { searchByImage, searchByDescription } from "@/lib/visual-search/search";
import { describeImage } from "@/lib/ai/vision";
import { getCurrentOrgId } from "@/lib/data/org";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const orgId = getCurrentOrgId();

    if (contentType.includes("multipart/form-data")) {
      // Image upload search via form data
      const formData = await request.formData();
      const file = formData.get("image") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "Image file is required" },
          { status: 400 },
        );
      }

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      // Generate description for the image
      let query = "";
      try {
        query = await describeImage(base64);
      } catch {
        query = "jewelry item";
      }

      const results = await searchByImage(base64, orgId, 5);

      return NextResponse.json({
        results: results.map((r) => ({
          id: r.product.id,
          name: r.product.name,
          description: r.product.description,
          category: r.product.category,
          price: r.product.price,
          imageUrl: r.product.imageUrl,
          score: r.score,
        })),
        query,
      });
    }

    // JSON body - could be base64 image or text query
    const body = await request.json();
    const { image, query } = body as {
      image?: string; // base64 encoded
      query?: string;
      orgId?: string;
    };

    const targetOrgId = body.orgId ?? orgId;

    if (image) {
      // Base64 image search
      let description = "";
      try {
        description = await describeImage(image);
      } catch {
        description = "jewelry item";
      }

      const results = await searchByImage(image, targetOrgId, 5);

      return NextResponse.json({
        results: results.map((r) => ({
          id: r.product.id,
          name: r.product.name,
          description: r.product.description,
          category: r.product.category,
          price: r.product.price,
          imageUrl: r.product.imageUrl,
          score: r.score,
        })),
        query: description,
      });
    }

    if (query && typeof query === "string") {
      // Text description search
      const results = searchByDescription(query, targetOrgId, 5);

      return NextResponse.json({
        results: results.map((r) => ({
          id: r.product.id,
          name: r.product.name,
          description: r.product.description,
          category: r.product.category,
          price: r.product.price,
          imageUrl: r.product.imageUrl,
          score: r.score,
        })),
        query,
      });
    }

    return NextResponse.json(
      { error: "Either image or query is required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("[API /search] Error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
}
