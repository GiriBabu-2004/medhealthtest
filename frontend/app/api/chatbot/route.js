import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai"; // ✅ New package

// ✅ Initialize Gemini with API key from environment
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Define how you want Gemini to behave
    const systemPrompt = `
You are the website's helpful assistant.
Answer only questions related to this website — its services, about section, contact details, and feedback page.
Be concise, friendly, and informative.
`;

    // ✅ Generate a response from Gemini
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash", // ✅ New, working model
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\nUser: ${message}` },
          ],
        },
      ],
    });

    // ✅ Use new SDK's output field
    const reply = response.output_text || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { reply: "Sorry, something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
