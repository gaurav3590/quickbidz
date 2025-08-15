import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Cancel Auction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/auctions/${params.id}/cancel`, {
      method: "PUT",
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to cancel auction" },
      { status: error.response?.status || 500 }
    );
  }
}
