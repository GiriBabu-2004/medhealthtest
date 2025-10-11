// /app/api/medsearch/upload/route.js
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

// Next.js App Router won't parse multipart automatically; we use formidable.
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const form = new formidable.IncomingForm();
    const parts = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = parts.files?.file || parts.files?.upload;
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Read file buffer
    const buffer = fs.readFileSync(file.filepath || file.path);

    // Extract text
    const data = await pdfParse(buffer);
    const text = data.text || '';

    return NextResponse.json({ success: true, text });
  } catch (err) {
    console.error('PDF upload error', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
