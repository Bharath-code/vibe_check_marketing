import { NextRequest, NextResponse } from "next/server";
import { saveEmail } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";

    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "invalid_email", message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Save email record associated with IP
    saveEmail({
      email,
      timestamp: new Date().toISOString(),
      ip
    });

    return NextResponse.json({
      success: true,
      message: "Email registered successfully! You have received 2 bonus checks for today."
    });

  } catch (error: any) {
    console.error("Error in /api/email route:", error);
    return NextResponse.json(
      { error: "server_error", message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
