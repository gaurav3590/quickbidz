import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Check if we're in a build environment
const isBuildTime =
  process.env.NODE_ENV === "production" && typeof window === "undefined";

// Get Unread Count
export async function GET(request: NextRequest) {
  // Return mock data during build time
  if (isBuildTime) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const response = await authorizedRequest("/notifications/unread-count");
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch unread count" },
      { status: error.response?.status || 500 }
    );
  }
}
