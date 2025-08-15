import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Get My Notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const read = searchParams.get("read");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const params: Record<string, string> = {
      page,
      limit,
    };

    if (read) params.read = read;

    const response = await authorizedRequest("/notifications/my", {
      params,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch your notifications" },
      { status: error.response?.status || 500 }
    );
  }
}
