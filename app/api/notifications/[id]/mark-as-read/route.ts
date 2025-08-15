import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Mark as Read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await authorizedRequest(
      `/notifications/${params.id}/mark-as-read`,
      {
        method: "PATCH",
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to mark notification as read" },
      { status: error.response?.status || 500 }
    );
  }
}
