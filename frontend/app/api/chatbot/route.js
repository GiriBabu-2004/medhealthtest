// app/api/chatbot/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `You are MedHealth Assistant, the friendly and knowledgeable AI built into MedHealth.ai — a health platform that helps users:
  • Upload and understand prescriptions and medicine images
  • Search for specific medicines and get detailed information
  • Track and manage personal health records (Save & Track feature)
  • Calculate BMI and monitor vitals

Your role:
- Answer questions about medicines, dosages, side effects, drug interactions, and general health topics in simple, clear language.
- Help users understand how to use MedHealth.ai's features (prescription upload, medicine search, Save & Track, BMI).
- Explain medical terms in easy-to-understand language.
- When users describe symptoms, provide general educational information but always recommend consulting a licensed doctor for diagnosis or treatment.
- Be warm, concise, and supportive. Use short paragraphs. Use bullet points only when listing 3 or more items.
- Never provide specific diagnoses. Never advise stopping prescribed medications without a doctor's guidance.
- If asked anything unrelated to health or MedHealth.ai (coding, politics, entertainment, etc.), politely say: "I'm specialized in health and MedHealth.ai topics. For that, I'd suggest using a general search engine!"

Keep responses under 120 words unless the topic genuinely needs more detail.`;

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { reply: "Please send a valid message." },
        { status: 400 }
      );
    }

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: message.trim() }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    // ✅ Correct field: response.text (NOT response.output_text)
    const reply =
      response.text?.trim() ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { reply: "Sorry, something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}