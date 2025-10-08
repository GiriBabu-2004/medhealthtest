import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, name, rating, message } = await req.json();

    if (!userId || !name || !rating || !message) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const feedback = await Feedback.create({ userId, name, rating, message });
    return NextResponse.json({ success: true, feedback });
  } catch (err) {
    console.error("❌ Feedback POST error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const feedbacks = await Feedback.find().sort({ rating: -1, createdAt: -1 }).limit(5);
    return NextResponse.json({ success: true, feedbacks });
  } catch (err) {
    console.error("❌ Feedback GET error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
