import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Get Auction by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/auctions/${params.id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch auction" },
      { status: error.response?.status || 500 }
    );
  }
}

// Update Auction
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await authorizedRequest(`/auctions/${params.id}`, {
      method: "PATCH",
      data: body,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update auction" },
      { status: error.response?.status || 500 }
    );
  }
}

// Delete Auction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/auctions/${params.id}`, {
      method: "DELETE",
    });

    return NextResponse.json({ message: "Auction deleted successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete auction" },
      { status: error.response?.status || 500 }
    );
  }
}
