import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Search Auctions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!term) {
      return NextResponse.json(
        { message: "Search term is required" },
        { status: 400 }
      );
    }

    const response = await authorizedRequest("/auctions/search", {
      params: {
        term,
        page,
        limit,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to search auctions" },
      { status: error.response?.status || 500 }
    );
  }
}
