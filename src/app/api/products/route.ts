import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProduct } from "@/services/productService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const rank = searchParams.get("rank") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const status = (searchParams.get("status") as any) || "available";
    const sortBy = (searchParams.get("sortBy") as any) || "newest";

    const products = await getProducts({
      search,
      rank,
      minPrice,
      maxPrice,
      status,
      sortBy,
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await saveProduct(body);
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
