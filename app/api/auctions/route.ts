import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";
import { getAuthTokens } from "@/lib/auth";

// Create Auction
export async function POST(formData: any) {
  try {
    // Send the form data directly to the backend
    const response = await authorizedRequest("/auctions", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating auction:", error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create auction",
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Get All Auctions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const sellerId = searchParams.get("sellerId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const params: Record<string, string> = {
      page,
      limit,
    };

    if (status) params.status = status;
    if (sellerId) params.sellerId = sellerId;

    const response = await authorizedRequest("/auctions/getAll", {
      params,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch auctions" },
      { status: error.response?.status || 500 }
    );
  }
}
