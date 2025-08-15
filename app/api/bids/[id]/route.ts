import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Get Bid by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/bids/${params.id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch bid" },
      { status: error.response?.status || 500 }
    );
  }
}

// Update Bid Status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await authorizedRequest(`/bids/${params.id}`, {
      method: "PATCH",
      data: body,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update bid" },
      { status: error.response?.status || 500 }
    );
  }
}

// Cancel Bid
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/bids/${params.id}`, {
      method: "DELETE",
    });

    return NextResponse.json({ message: "Bid cancelled." });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to cancel bid" },
      { status: error.response?.status || 500 }
    );
  }
}
