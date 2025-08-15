import { NextRequest, NextResponse } from "next/server";
import { getServerAuthToken } from "@/lib/auth-server";
import { jwtDecode } from "jwt-decode";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const token = await getServerAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in to register for notifications" },
        { status: 401 }
      );
    }
    
    // Decode token to get user info
    const decoded = jwtDecode(token);
    const userId = decoded.sub || "unknown";

    // Get FCM token from request body
    const { fcmToken } = await request.json();

    if (!fcmToken) {
      return NextResponse.json(
        { error: "FCM token is required" },
        { status: 400 }
      );
    }

    // For now, just log the token (until backend is implemented)
    console.log(
      `Registered FCM token for user ${userId}: ${fcmToken.substring(
        0,
        10
      )}...`
    );

    return NextResponse.json(
      { success: true, message: "FCM token registered successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error registering FCM token:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while registering FCM token",
      },
      { status: 500 }
    );
  }
}
