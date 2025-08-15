import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Get Comment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/comments/${params.id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch comment" },
      { status: error.response?.status || 500 }
    );
  }
}

// Update Comment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await authorizedRequest(`/comments/${params.id}`, {
      method: "PATCH",
      data: body,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update comment" },
      { status: error.response?.status || 500 }
    );
  }
}

// Delete Comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/comments/${params.id}`, {
      method: "DELETE",
    });

    return NextResponse.json({ message: "Comment deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete comment" },
      { status: error.response?.status || 500 }
    );
  }
}
