import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TrackRecord from "@/models/TrackRecord";

// OpenRouter
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3.1:free";

// Helper: calculate age from DOB
function calculateAge(dobStr) {
  if (!dobStr) return null;
  const [day, month, year] = dobStr.split("-").map(Number);
  const dob = new Date(year, month - 1, day);
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

// Helper: extract relevant PDF info
function extractPatientInfo(pdfText) {
  if (!pdfText) return {};
  const ageMatch = pdfText.match(/DOB:\s*(\d{2}-\d{2}-\d{4})/i);
  const age = ageMatch ? calculateAge(ageMatch[1]) : null;

  const medHistoryMatch = pdfText.match(/Medical History([\s\S]*?)Lifestyle/i);
  const medHistory = medHistoryMatch ? medHistoryMatch[1].trim() : "";

  const symptomsMatch = pdfText.match(/Symptoms([\s\S]*?)Vitals/i);
  const symptoms = symptomsMatch ? symptomsMatch[1].trim() : "";

  const allergiesMatch = pdfText.match(/Allergies:\s*(.*)/i);
  const allergies = allergiesMatch ? allergiesMatch[1].trim() : "";

  return { age, medHistory, symptoms, allergies };
}

// Prepare PDF snippet (limit size)
function preparePdfText(text, maxChars = 1500) {
  if (!text) return "None";
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > maxChars ? cleaned.slice(0, maxChars) + "..." : cleaned;
}

// Call OpenRouter
async function callOpenRouter(prompt) {
  if (!OPENROUTER_KEY) return { success: false, error: "Missing OpenRouter API key" };

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a concise and safe medical assistant. ALWAYS reply in valid JSON ONLY.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    const rawText = await res.text();
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      console.error("⚠️ OpenRouter returned non-JSON snippet:", rawText.slice(0, 200));
      throw new Error("Invalid response from OpenRouter");
    }

    const data = JSON.parse(rawText);
    const output = data?.choices?.[0]?.message?.content || "";
    return { success: true, output };
  } catch (err) {
    console.error("❌ OpenRouter error:", err);
    return { success: false, error: err.message };
  }
}

// Main route
export async function POST(req) {
  try {
    await connectDB();
    const { query, userId, pdfText } = await req.json();

    if (!query || !userId)
      return NextResponse.json({ success: false, message: "Missing query or userId" }, { status: 400 });

    const userRecords = await TrackRecord.find({ userId });
    const userCurrentMeds = userRecords.flatMap((r) =>
      (r.currentMedications || "").split(/[,;\n]/).map((m) => m.trim()).filter(Boolean)
    );
    const uniqueCurrentMeds = Array.from(new Set(userCurrentMeds));

    // Extract patient info from PDF
    const patientInfo = extractPatientInfo(pdfText);
    const pdfSnippet = preparePdfText(`${patientInfo.medHistory} ${patientInfo.symptoms} Allergies: ${patientInfo.allergies}`);

    // Build prompt
    const prompt = `
User typed medicine: "${query}"
Patient age: ${patientInfo.age || "Unknown"}
Patient medical history: ${patientInfo.medHistory || "None"}
Patient symptoms: ${patientInfo.symptoms || "None"}
Patient allergies: ${patientInfo.allergies || "None"}
User current medications: ${uniqueCurrentMeds.join(", ") || "None"}
PDF snippet: ${pdfSnippet}

Task:
Suggest 5-10 relevant medicines for the patient, including:
- same active ingredient
- brand alternatives
- safe substitutes

Return STRICTLY in JSON:
{
  "suggestions": ["Medicine A", "Medicine B"],
  "reasons": ["short reason per suggestion"],
  "warnings": ["if any interactions or contraindications"]
}
`;

    const llmResult = await callOpenRouter(prompt);

    let suggestions = [], reasons = [], warnings = [];
    if (llmResult.success && llmResult.output) {
      try {
        const jsonMatch = llmResult.output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
          reasons = Array.isArray(parsed.reasons) ? parsed.reasons : [];
          warnings = Array.isArray(parsed.warnings) ? parsed.warnings : [];
        } else {
          console.warn("⚠️ LLM returned no valid JSON object");
        }
      } catch (err) {
        console.warn("⚠️ JSON parse failed:", err.message);
      }
    }

    // Fallback: DB partial match
    if (suggestions.length === 0) {
      const regex = new RegExp(query.split(/\s+/).slice(0, 2).join(" "), "i");
      suggestions = Array.from(
        new Set(
          userRecords
            .map((r) => r.medicineName || r.currentMedications || "")
            .filter(Boolean)
            .filter((m) => regex.test(m))
        )
      ).slice(0, 5);
    }

    return NextResponse.json({
      success: true,
      query,
      suggestions,
      reasons,
      warnings,
      rawLLM: llmResult.output || null,
    });
  } catch (err) {
    console.error("❌ MedSearch POST error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
