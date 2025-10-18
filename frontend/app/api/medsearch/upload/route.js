// /app/api/medsearch/upload/route.js
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert Web Request → Node.js stream for formidable
async function toNodeRequest(req) {
  const contentType = req.headers.get("content-type");
  const buffer = Buffer.from(await req.arrayBuffer());
  const stream = Readable.from(buffer);
  stream.headers = { "content-type": contentType };
  return stream;
}

export async function POST(req) {
  try {
    const nodeReq = await toNodeRequest(req);
    const form = formidable({ multiples: false });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files?.file || files?.upload;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Read the uploaded file
    const buffer = fs.readFileSync(file.filepath || file.path);
    const data = await pdfParse(buffer);
    const text = data.text || "";

    return NextResponse.json({ success: true, text });
  } catch (err) {
    console.error("PDF upload error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
