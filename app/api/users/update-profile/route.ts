import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

export async function PUT(request: NextRequest) {
  try {
    // Get the JSON data from the request
    const data = await request.json();
    
    // Validate the data
    const { username, fullName, bio } = data;
    
    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }
    
    // Send the data to the backend
    const response = await authorizedRequest("/users/profile", {
      method: "PUT",
      data: {
        username,
        fullName,
        bio
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || error.message || "Failed to update profile" },
      { status: error.response?.status || 500 }
    );
  }
} 