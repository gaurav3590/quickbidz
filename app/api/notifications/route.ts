import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";
import { useUser } from "@/components/providers/UserContext";

// Create Notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await authorizedRequest("/notifications", {
      method: "POST",
      data: body,
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create notification" },
      { status: error.response?.status || 500 }
    );
  }
}

// Get All Notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const read = searchParams.get("read");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const params: Record<string, string> = {
      page,
      limit,
    };

    if (userId) params.userId = userId;
    if (read) params.read = read;

    const response = await authorizedRequest("/notifications", {
      params,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch notifications" },
      { status: error.response?.status || 500 }
    );
  }
}

// Note: FCM token registration is handled in the register-token route
