import { NextRequest, NextResponse } from "next/server";
import { authorizedRequest } from "@/lib/api";

// Delete All Read Notifications
export async function DELETE(request: NextRequest) {
  try {
    const response = await authorizedRequest("/notifications/delete-all-read", {
      method: "DELETE",
    });

    return NextResponse.json({ message: "All read notifications deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete read notifications" },
      { status: error.response?.status || 500 }
    );
  }
}
