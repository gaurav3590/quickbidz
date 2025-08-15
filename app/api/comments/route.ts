import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Create Comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await authorizedRequest("/comments", {
      method: "POST",
      data: body,
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create comment" },
      { status: error.response?.status || 500 }
    );
  }
}

// Get All Comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get("auctionId");
    const parentId = searchParams.get("parentId");
    const userId = searchParams.get("userId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const params: Record<string, string> = {
      page,
      limit,
    };

    if (auctionId) params.auctionId = auctionId;
    if (parentId) params.parentId = parentId;
    if (userId) params.userId = userId;

    const response = await authorizedRequest("/comments", {
      params,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch comments" },
      { status: error.response?.status || 500 }
    );
  }
}
