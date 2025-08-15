import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Check if we're in a build environment
const isBuildTime =
  process.env.NODE_ENV === "production" && typeof window === "undefined";

// Get My Bids
export async function GET(request: NextRequest) {
  // Return mock data during build time
  if (isBuildTime) {
    return NextResponse.json({
      bids: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const response = await authorizedRequest("/bids/my-bids", {
      params: {
        page,
        limit,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch your bids" },
      { status: error.response?.status || 500 }
    );
  }
}
