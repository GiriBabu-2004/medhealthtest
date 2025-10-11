import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TrackRecord from '@/models/TrackRecord';

// OpenRouter
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL ; // free model

async function callOpenRouter(prompt) {
  if (!OPENROUTER_KEY) return { success: false, error: "Missing OpenRouter API key" };
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: "You are a concise and safe medical assistant. Output only JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`OpenRouter API error: ${res.status} ${txt}`);
    }

    const json = await res.json();
    const output = json?.choices?.[0]?.message?.content || JSON.stringify(json);
    return { success: true, output };
  } catch (err) {
    console.error("OpenRouter error:", err);
    return { success: false, error: err.message };
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { query, userId, pdfText } = await req.json();
    if (!query || !userId) return NextResponse.json({ success: false, message: "Missing query or userId" }, { status: 400 });

    // Fetch user TrackRecords
    const userRecords = await TrackRecord.find({ userId });

    // Extract user's current medications
    const userCurrentMeds = userRecords.flatMap(r => {
      if (!r.currentMedications) return [];
      return r.currentMedications.split(/[,;\n]/).map(m => m.trim()).filter(Boolean);
    });
    const uniqueCurrentMeds = Array.from(new Set(userCurrentMeds));

    // Build prompt for OpenRouter
    const prompt = `
User typed: "${query}"
User current medications: ${uniqueCurrentMeds.join(", ") || "None"}
Extracted PDF / TrackRecord text: ${pdfText || "None"}

Task:
Suggest medicines related to "${query}" (same active ingredient, brand alternatives, safe substitutes).
Return only JSON:
{
  "suggestions": ["Medicine A", "Medicine B"],
  "reasons": ["short reason per suggestion"],
  "warnings": ["if any interactions or contraindications"]
}
If unsure, return empty arrays.
`;

    const llmResult = await callOpenRouter(prompt);
    let parsed = null;
    if (llmResult.success && llmResult.output) {
      try {
        const text = llmResult.output.trim();
        const jsonStart = text.indexOf("{");
        const jsonText = jsonStart >= 0 ? text.slice(jsonStart) : text;
        parsed = JSON.parse(jsonText);
      } catch (e) {
        console.warn("⚠️ Failed to parse OpenRouter output:", e.message);
      }
    }

    // Fallback: suggestions from user history if LLM fails
    let suggestions = [];
    let warnings = [];
    if (parsed && Array.isArray(parsed.suggestions)) {
      suggestions = parsed.suggestions;
      warnings = parsed.warnings || [];
    } else {
      // Try partial matches from TrackRecords
      const regex = new RegExp(query.split(/\s+/).slice(0, 2).join(" "), "i");
      suggestions = Array.from(new Set(userRecords
        .map(r => r.medicineName || r.currentMedications || "")
        .filter(Boolean)
        .filter(m => regex.test(m))
      )).slice(0, 10);
    }

    return NextResponse.json({
      success: true,
      query,
      suggestions,
      warnings,
      rawLLM: llmResult.output || null,
    });

  } catch (err) {
    console.error("MedSearch POST error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
