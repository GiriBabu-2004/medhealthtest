import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TrackRecord from "@/models/TrackRecord";

// 🩺 Save a new record
export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    // 🛡️ Validate userId presence (for Firebase auth linkage)
    if (!data.userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId. Please log in again." },
        { status: 400 }
      );
    }

    const record = await TrackRecord.create(data);
    return NextResponse.json({ success: true, record });
  } catch (err) {
    console.error("Error saving record:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// 📋 Get all records for the logged-in user
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId in query." },
        { status: 400 }
      );
    }

    const records = await TrackRecord.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, records });
  } catch (err) {
    console.error("Error fetching records:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
