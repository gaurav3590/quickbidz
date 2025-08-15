import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Get Auction Comments
export async function GET(
  request: NextRequest,
  { params }: { params: { auctionId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const queryParams: Record<string, string> = {
      page,
      limit,
    };

    if (parentId) queryParams.parentId = parentId;

    const response = await authorizedRequest(
      `/comments/auction/${params.auctionId}`,
      {
        params: queryParams,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch auction comments" },
      { status: error.response?.status || 500 }
    );
  }
}
