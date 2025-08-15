import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Get Auction Bids
export async function GET(
  request: NextRequest,
  { params }: { params: { auctionId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const response = await authorizedRequest(
      `/bids/auction/${params.auctionId}`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch auction bids" },
      { status: error.response?.status || 500 }
    );
  }
}
