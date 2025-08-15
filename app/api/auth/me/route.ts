import { NextRequest, NextResponse } from "next/server";
import { getAuthTokens } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // In a real application, this would validate the token with your backend
    // For now, we'll just check if the token exists in cookies
    const tokens = getAuthTokens();

    if (!tokens) {
      return NextResponse.json(
        { message: "Authentication token missing or expired" },
        { status: 401 }
      );
    }

    // In a real application, this would return the actual user data
    // For now, we'll return a mock user
    return NextResponse.json({
      id: "user-id",
      username: "user",
      email: "user@example.com",
      firstName: "Authenticated",
      lastName: "User",
      isVerified: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Authentication failed" },
      { status: 401 }
    );
  }
}
