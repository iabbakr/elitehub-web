import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to allow searchParams access at runtime
export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://elitehub-backend.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const qs = searchParams.toString();

    // Fetching from the external API
    const res = await fetch(`${API_BASE}/products?${qs}`, {
      // Revalidation logic inside fetch
      next: { revalidate: 60 }, 
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { products: [], hasMore: false, error: `Backend error: ${res.status}` }, 
        { status: res.status }
      );
    }

    const data = await res.json();

    // Return the data with Cache-Control headers for the browser/CDN
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, max-age=60",
      },
    });
  } catch (err: any) {
    console.error("[/api/products] Error:", err);
    return NextResponse.json(
      { products: [], hasMore: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}