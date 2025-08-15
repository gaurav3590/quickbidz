import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Get My Comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const response = await authorizedRequest("/comments/my-comments", {
      params: {
        page,
        limit,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch your comments" },
      { status: error.response?.status || 500 }
    );
  }
}
