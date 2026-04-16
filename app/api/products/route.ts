import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://elitehub-backend.onrender.com/api/v1";

export const revalidate = 60; // 1 minute ISR

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const qs = searchParams.toString();

    const res = await fetch(`${API_BASE}/products?${qs}`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ products: [], hasMore: false, error: `Backend error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, max-age=60",
      },
    });
  } catch (err: any) {
    console.error("[/api/products]", err);
    return NextResponse.json(
      { products: [], hasMore: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
