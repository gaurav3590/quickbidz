import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Get Notification by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/notifications/${params.id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch notification" },
      { status: error.response?.status || 500 }
    );
  }
}

// Update Notification
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await authorizedRequest(`/notifications/${params.id}`, {
      method: "PATCH",
      data: body,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update notification" },
      { status: error.response?.status || 500 }
    );
  }
}

// Delete Notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(`/notifications/${params.id}`, {
      method: "DELETE",
    });

    return NextResponse.json({ message: "Notification deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete notification" },
      { status: error.response?.status || 500 }
    );
  }
}
