'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

// ─── Icons (inline SVG to avoid extra deps) ────────────────────────────────
const icons = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 0 0 1.56 1.24C7 19 8 18 12 18c4 0 6-2 6-6 0-2-.5-4-1-4z" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  thermometer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 transition-transform duration-300">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};

// ─── Field Input Component ──────────────────────────────────────────────────
function FieldInput({ name, label, value, onChange, readOnly, type = 'text', hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={hint || `Enter ${label.toLowerCase()}`}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 transition-all duration-200 outline-none
          ${readOnly
            ? 'bg-green-50 border-green-200 text-green-700 font-semibold cursor-default'
            : 'bg-white border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 hover:border-gray-300'
          }`}
      />
    </div>
  );
}

// ─── Progress Bar ───────────────────────────────────────────────────────────
function ProgressBar({ sections, form }) {
  const filled = sections.reduce((acc, sec) => {
    return acc + sec.fields.filter(([name]) => form[name] && form[name] !== '').length;
  }, 0);
  const total = sections.reduce((acc, sec) => acc + sec.fields.length, 0);
  const pct = Math.round((filled / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Form Completion</span>
        <span className="text-sm font-bold text-green-600">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Section Card ───────────────────────────────────────────────────────────
function SectionCard({ section, index, isOpen, onToggle, form, onChange, isSaved }) {
  const filledCount = section.fields.filter(([name]) => form[name] && form[name] !== '').length;
  const isComplete = filledCount === section.fields.length;

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden
      ${isOpen ? 'border-green-400 shadow-md shadow-green-50' : 'border-gray-200 hover:border-gray-300'}
      ${isSaved ? 'opacity-60' : ''}`}
    >
      {/* Section Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        {/* Step Badge */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors duration-300
          ${isComplete ? 'bg-green-500' : isOpen ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          {isComplete ? icons.check : index + 1}
        </div>

        {/* Icon + Title */}
        <div className={`flex items-center gap-2 flex-1 transition-colors duration-200 ${isOpen ? 'text-green-600' : 'text-gray-700'}`}>
          <span className={isOpen ? 'text-green-500' : 'text-gray-400'}>{section.icon}</span>
          <span className="font-semibold text-base">{section.title}</span>
        </div>

        {/* Fill count + Chevron */}
        <div className="flex items-center gap-3 text-gray-400">
          {filledCount > 0 && (
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
              {filledCount}/{section.fields.length}
            </span>
          )}
          <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            {icons.chevron}
          </span>
        </div>
      </button>

      {/* Section Body */}
      {isOpen && (
        <div className="px-4 pb-5 pt-1 bg-white border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {section.fields.map(([name, label, hint, type]) => (
              <FieldInput
                key={name}
                name={name}
                label={label}
                value={form[name]}
                onChange={onChange}
                readOnly={name === 'bmi'}
                hint={hint}
                type={type}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function SaveTrackPage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [openSection, setOpenSection] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });
    return () => unsub();
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'height' || name === 'weight') {
        const h = name === 'height' ? value : prev.height;
        const w = name === 'weight' ? value : prev.weight;
        if (h && w && parseFloat(h) > 0) {
          updated.bmi = (parseFloat(w) / ((parseFloat(h) / 100) ** 2)).toFixed(1);
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in first.');
    setIsLoading(true);
    const payload = { ...form, userId: user.uid };

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        generatePDF(payload);
      } else {
        alert('Error saving record.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const PW = 595.28; // A4 width in pt
    const PH = 841.89; // A4 height in pt
    const MARGIN = 40;
    const CONTENT_W = PW - MARGIN * 2;

    // ── Color palette ──────────────────────────────────────────────
    const GREEN      = [34, 197, 94];    // brand green
    const GREEN_DARK = [21, 128, 61];    // darker green
    const GREEN_LIGHT= [240, 253, 244];  // very light green bg
    const GRAY_DARK  = [30, 41, 59];     // near-black text
    const GRAY_MID   = [100, 116, 139];  // muted text
    const GRAY_LIGHT = [248, 250, 252];  // alternating row bg
    const WHITE      = [255, 255, 255];

    // ── Helper: set RGB fill ───────────────────────────────────────
    const fill  = ([r,g,b]) => doc.setFillColor(r, g, b);
    const stroke= ([r,g,b]) => doc.setDrawColor(r, g, b);
    const color = ([r,g,b]) => doc.setTextColor(r, g, b);

    // ── Helper: draw rounded rect (jsPDF supports 'FD', 'F', 'D') ─
    const rRect = (x, y, w, h, r, style='F') => doc.roundedRect(x, y, w, h, r, r, style);

    // ── Page counter helper ────────────────────────────────────────
    let pageNum = 1;
    const addPageFooter = () => {
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        // bottom bar
        fill(GREEN_DARK); doc.rect(0, PH - 32, PW, 32, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        color([134, 239, 172]); doc.text('MedHe', MARGIN, PH - 12);
        const fW = doc.getTextWidth('MedHe');
        color(WHITE); doc.text('alth.ai', MARGIN + fW, PH - 12);
        doc.setFont('helvetica', 'normal');
        color([220, 252, 231]);
        doc.text('  |  Confidential Medical Record  |  Do not share without patient consent',
          MARGIN + fW + doc.getTextWidth('alth.ai'), PH - 12);
        color(WHITE);
        doc.text(`Page ${p} of ${totalPages}`, PW - MARGIN, PH - 12, { align: 'right' });
      }
    };

    // ── Draw header (called on first page only) ────────────────────
    const drawHeader = () => {
      // Top green band
      fill(GREEN); doc.rect(0, 0, PW, 90, 'F');
      // Subtle diagonal accent strip
      fill(GREEN_DARK);
      doc.triangle(PW - 160, 0, PW, 0, PW, 90, 'F');

      // ─ Logo mark (circle + cross) ─
      const lx = MARGIN + 22, ly = 45;
      fill(WHITE); doc.circle(lx, ly, 20, 'F');
      fill(GREEN);
      doc.rect(lx - 2, ly - 10, 4, 20, 'F'); // vertical bar
      doc.rect(lx - 10, ly - 2, 20, 4, 'F'); // horizontal bar

      // ─ Brand text: "MedHe" in bright green, "alth.ai" in white ─
      doc.setFont('helvetica', 'bold'); doc.setFontSize(24);
      // "MedHe" in green-300 (bright, pops on the green background band)
      color([134, 239, 172]);
      doc.text('MedHe', lx + 28, ly + 4);
      const medHeWidth = doc.getTextWidth('MedHe');
      // "alth.ai" in white
      color(WHITE);
      doc.text('alth.ai', lx + 28 + medHeWidth, ly + 4);
      // Tagline below
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
      color([220, 252, 231]);
      doc.text('Personal Health Record', lx + 28, ly + 18);

      // ─ Right side: record date & ID ─
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
      const timeStr = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
      const recId = 'MH-' + Math.random().toString(36).substring(2,8).toUpperCase();
      color(WHITE);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
      doc.text(`Generated: ${dateStr}, ${timeStr}`, PW - MARGIN, 30, { align:'right' });
      doc.text(`Record ID: ${recId}`, PW - MARGIN, 44, { align:'right' });
      doc.text('CONFIDENTIAL', PW - MARGIN, 58, { align:'right' });
    };

    // ── State for y cursor across pages ───────────────────────────
    let y = 0;

    const checkNewPage = (needed = 60) => {
      if (y + needed > PH - 50) {
        doc.addPage();
        // Repeat a slim header on subsequent pages
        fill(GREEN); doc.rect(0, 0, PW, 36, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
        color([134, 239, 172]); doc.text('MedHe', MARGIN, 23);
        const mhW = doc.getTextWidth('MedHe');
        color(WHITE); doc.text('alth.ai', MARGIN + mhW, 23);
        doc.setFont('helvetica', 'normal'); color([220, 252, 231]);
        doc.text('  —  Medical Record (continued)', MARGIN + mhW + doc.getTextWidth('alth.ai'), 23);
        const now2 = new Date();
        doc.setFont('helvetica','normal'); doc.setFontSize(8);
        doc.text(now2.toLocaleDateString('en-IN'), PW - MARGIN, 23, { align:'right'});
        y = 52;
      }
    };

    // ── Draw a section block ───────────────────────────────────────
    const drawSection = (title, icon, fields) => {
      const validFields = fields.filter(([, val]) => val && val !== '');
      if (validFields.length === 0) return;

      checkNewPage(50 + validFields.length * 22);

      // Section header pill
      fill(GREEN_LIGHT); rRect(MARGIN, y, CONTENT_W, 26, 4);
      // Green left accent bar
      fill(GREEN); doc.rect(MARGIN, y, 4, 26, 'F');
      // Icon circle
      fill(GREEN); doc.circle(MARGIN + 22, y + 13, 9, 'F');
      color(WHITE); doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
      doc.text(icon, MARGIN + 22, y + 16, { align: 'center' });
      // Title text
      color(GREEN_DARK); doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5);
      doc.text(title.toUpperCase(), MARGIN + 38, y + 17);
      // Field count badge
      const badge = `${validFields.length} entries`;
      color(GRAY_MID); doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
      doc.text(badge, PW - MARGIN - 4, y + 17, { align:'right' });

      y += 30;

      // Rows — alternating background
      validFields.forEach(([label, val], idx) => {
        checkNewPage(24);
        if (idx % 2 === 0) { fill(GRAY_LIGHT); doc.rect(MARGIN, y, CONTENT_W, 20, 'F'); }

        // Label
        color(GRAY_MID); doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
        doc.text(label, MARGIN + 10, y + 13);
        // Dotted separator line
        stroke(GRAY_MID); doc.setLineWidth(0.3);
        doc.setLineDashPattern([1, 2], 0);
        doc.line(MARGIN + 130, y + 11, MARGIN + 140, y + 11);
        doc.setLineDashPattern([], 0);
        // Value
        color(GRAY_DARK); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        const maxW = CONTENT_W - 150;
        const lines = doc.splitTextToSize(String(val), maxW);
        doc.text(lines[0], MARGIN + 145, y + 13); // first line inline
        y += 20;
        if (lines.length > 1) {
          lines.slice(1).forEach(line => {
            checkNewPage(16);
            color(GRAY_DARK); doc.setFont('helvetica','normal'); doc.setFontSize(9);
            doc.text(line, MARGIN + 145, y + 10);
            y += 14;
          });
        }
      });

      // Bottom border of section
      stroke([220, 234, 220]); doc.setLineWidth(0.5);
      doc.line(MARGIN, y + 4, PW - MARGIN, y + 4);
      y += 16;
    };

    // ── Draw verification footer block ────────────────────────────
    const drawVerification = () => {
      checkNewPage(120);
      y += 10;

      // Outer box
      stroke(GREEN); doc.setLineWidth(1);
      rRect(MARGIN, y, CONTENT_W, 100, 6, 'D');

      // Green top strip inside box
      fill(GREEN); rRect(MARGIN, y, CONTENT_W, 22, 6, 'F');
      doc.rect(MARGIN, y + 12, CONTENT_W, 10, 'F'); // fill bottom corners of strip

      color(WHITE); doc.setFont('helvetica','bold'); doc.setFontSize(9);
      doc.text('SYSTEM VERIFICATION & AUTHENTICITY CERTIFICATE', PW / 2, y + 15, { align:'center' });

      // Content inside box
      const bx = MARGIN + 16, by = y + 32;

      // Checkmark circle
      fill(GREEN); doc.circle(bx + 6, by + 6, 7, 'F');
      color(WHITE); doc.setFont('helvetica','bold'); doc.setFontSize(10);
      doc.text('✓', bx + 6, by + 10, { align:'center' });

      color(GRAY_DARK); doc.setFont('helvetica','bold'); doc.setFontSize(9);
      doc.text('Computer Generated Record', bx + 18, by + 8);
      color(GRAY_MID); doc.setFont('helvetica','normal'); doc.setFontSize(8);
      doc.text('This document was automatically generated by MedHealth.ai systems and is digitally verified.', bx + 18, by + 20);

      // Divider
      stroke([200,230,200]); doc.setLineWidth(0.4);
      doc.line(MARGIN + 10, by + 28, PW - MARGIN - 10, by + 28);

      // Three columns: timestamp | record id | platform
      const now3 = new Date();
      const col1x = MARGIN + 20, col2x = PW / 2 - 40, col3x = PW - MARGIN - 120;
      const colY = by + 42;

      color(GRAY_MID); doc.setFont('helvetica','bold'); doc.setFontSize(7);
      doc.text('GENERATED ON', col1x, colY - 8);
      color(GRAY_DARK); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
      doc.text(now3.toLocaleString('en-IN'), col1x, colY);

      color(GRAY_MID); doc.setFont('helvetica','bold'); doc.setFontSize(7);
      doc.text('RECORD TYPE', col2x, colY - 8);
      color(GRAY_DARK); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
      doc.text('Personal Medical Summary', col2x, colY);

      color(GRAY_MID); doc.setFont('helvetica','bold'); doc.setFontSize(7);
      doc.text('PLATFORM', col3x, colY - 8);
      color(GREEN_DARK); doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
      doc.text('MedHealth.ai', col3x, colY);

      // Disclaimer
      color(GRAY_MID); doc.setFont('helvetica','italic'); doc.setFontSize(7);
      doc.text(
        'This record is for personal reference only and does not constitute medical advice. Consult a licensed physician for diagnosis or treatment.',
        PW / 2, y + 96, { align: 'center', maxWidth: CONTENT_W - 20 }
      );

      y += 110;
    };

    // ═══════════════════════════════════════════════════════════════
    // BUILD THE PDF
    // ═══════════════════════════════════════════════════════════════
    drawHeader();
    y = 106;

    // Patient name banner
    if (data.fullName) {
      fill(GRAY_DARK); rRect(MARGIN, y, CONTENT_W, 32, 4);
      color(WHITE); doc.setFont('helvetica','bold'); doc.setFontSize(13);
      doc.text(data.fullName, MARGIN + 14, y + 21);
      color(GREEN); doc.setFont('helvetica','normal'); doc.setFontSize(8);
      const subtitle = [data.gender, data.dob, data.nationality].filter(Boolean).join('  •  ');
      if (subtitle) doc.text(subtitle, PW - MARGIN - 10, y + 21, { align:'right' });
      y += 44;
    }

    // Sections
    drawSection('Personal Identification', 'ID', [
      ['Full Name', data.fullName], ['Date of Birth', data.dob],
      ['Gender', data.gender], ['Nationality', data.nationality],
      ['Contact Number', data.contactNumber], ['Email Address', data.email],
      ['Address', data.address], ['Emergency Contact', data.emergencyContact],
    ]);

    drawSection('Medical History', 'Rx', [
      ['Chronic Conditions', data.chronicConditions], ['Past Surgeries', data.pastSurgeries],
      ['Hospitalizations', data.pastHospitalizations], ['Current Medications', data.currentMedications],
      ['Allergies', data.allergies], ['Family History', data.familyHistory],
      ['Vaccination History', data.vaccinationHistory],
    ]);

    drawSection('Lifestyle & Habits', 'Lf', [
      ['Smoking Status', data.smokingStatus], ['Alcohol Consumption', data.alcoholConsumption],
      ['Drug Use', data.drugUse], ['Exercise Frequency', data.exerciseFrequency],
      ['Diet', data.diet], ['Sleep Patterns', data.sleepPatterns],
    ]);

    drawSection('Symptoms & Complaints', 'Sx', [
      ['Date of Onset', data.onsetDate], ['Symptom Description', data.symptomDescription],
      ['Severity', data.severity], ['Duration', data.duration],
      ['Triggers / Relievers', data.triggers],
    ]);

    drawSection('Vitals & Measurements', 'Vt', [
      ['Height', data.height ? `${data.height} cm` : null],
      ['Weight', data.weight ? `${data.weight} kg` : null],
      ['BMI', data.bmi], ['Blood Pressure', data.bloodPressure],
      ['Heart Rate', data.heartRate ? `${data.heartRate} bpm` : null],
      ['Respiratory Rate', data.respiratoryRate],
      ['Body Temperature', data.bodyTemperature],
      ['SpO2 / Blood Oxygen', data.bloodOxygen],
    ]);

    drawVerification();
    addPageFooter(); // stamp page numbers on all pages last

    doc.save(`${data.fullName || 'Medical_Record'}_MedHealth.pdf`);
  };

  const sections = [
    {
      title: 'Personal Identification',
      icon: icons.user,
      fields: [
        ['fullName', 'Full Name', 'e.g. Aisha Sharma'],
        ['dob', 'Date of Birth', '', 'date'],
        ['gender', 'Gender', 'e.g. Female'],
        ['nationality', 'Nationality', 'e.g. Indian'],
        ['contactNumber', 'Contact Number', 'e.g. +91 98765 43210'],
        ['email', 'Email Address', 'e.g. aisha@email.com', 'email'],
        ['address', 'Address', 'City, State, Country'],
        ['emergencyContact', 'Emergency Contact', 'Name & phone number'],
      ],
    },
    {
      title: 'Medical History',
      icon: icons.heart,
      fields: [
        ['chronicConditions', 'Chronic Conditions', 'e.g. Diabetes, Hypertension'],
        ['pastSurgeries', 'Past Surgeries', 'e.g. Appendectomy (2019)'],
        ['pastHospitalizations', 'Past Hospitalizations', 'Brief description'],
        ['currentMedications', 'Current Medications', 'Name, dosage, frequency'],
        ['allergies', 'Allergies', 'e.g. Penicillin, Pollen'],
        ['familyHistory', 'Family History', 'e.g. Heart disease, Diabetes'],
        ['vaccinationHistory', 'Vaccination History', 'e.g. COVID-19, Flu (2024)'],
      ],
    },
    {
      title: 'Lifestyle & Habits',
      icon: icons.leaf,
      fields: [
        ['smokingStatus', 'Smoking Status', 'Non-smoker / Ex-smoker / Active'],
        ['alcoholConsumption', 'Alcohol Consumption', 'Never / Occasional / Regular'],
        ['drugUse', 'Drug Use', 'None / Recreational / Prescribed'],
        ['exerciseFrequency', 'Exercise Frequency', 'e.g. 3x/week, 30 min walks'],
        ['diet', 'Diet', 'e.g. Vegetarian, Low-carb'],
        ['sleepPatterns', 'Sleep Patterns', 'e.g. 7 hrs, trouble falling asleep'],
      ],
    },
    {
      title: 'Symptoms & Complaints',
      icon: icons.activity,
      fields: [
        ['onsetDate', 'Date of Onset', '', 'date'],
        ['symptomDescription', 'Symptom Description', 'Describe what you are feeling'],
        ['severity', 'Severity', 'Mild / Moderate / Severe'],
        ['duration', 'Duration', 'e.g. 3 days, 2 weeks'],
        ['triggers', 'Triggers / Relievers', 'What makes it better or worse'],
      ],
    },
    {
      title: 'Vitals & Measurements',
      icon: icons.thermometer,
      fields: [
        ['height', 'Height (cm)', 'e.g. 165', 'number'],
        ['weight', 'Weight (kg)', 'e.g. 60', 'number'],
        ['bmi', 'BMI (auto-calculated)', ''],
        ['bloodPressure', 'Blood Pressure', 'e.g. 120/80 mmHg'],
        ['heartRate', 'Heart Rate (bpm)', 'e.g. 72', 'number'],
        ['respiratoryRate', 'Respiratory Rate', 'e.g. 16 breaths/min'],
        ['bodyTemperature', 'Body Temperature', 'e.g. 98.6°F / 37°C'],
        ['bloodOxygen', 'SpO2 (%)', 'e.g. 98%'],
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
          <div className="absolute top-5 left-5">
  <div className={`text-2xl font-extrabold ${poppins.className}`}>
    <span className="text-green-500">MedHe</span>
    <span className="text-black">alth.ai</span>
  </div>
</div>
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
          Secure & Private
        </div>
        <h1 className={`text-4xl font-bold text-gray-900 mb-3 ${poppins.className}`}>
          Save &amp; Track{' '}
          <span className="text-green-500">Medical Records</span>
        </h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          Fill in your health information below. Your data is saved securely and a PDF report is generated automatically.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Success Banner */}
        {isSaved && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-300 text-green-800 px-5 py-4 rounded-xl shadow-sm">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
              {icons.check}
            </span>
            <div>
              <p className="font-semibold">Record saved successfully!</p>
              <p className="text-sm text-green-600">Your PDF has been downloaded.</p>
            </div>
            <button
              onClick={() => { setIsSaved(false); setForm({}); setOpenSection(0); }}
              className="ml-auto text-sm underline text-green-700 hover:text-green-900"
            >
              Start New
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <ProgressBar sections={sections} form={form} />

          <div className="space-y-3">
            {sections.map((sec, i) => (
              <SectionCard
                key={i}
                section={sec}
                index={i}
                isOpen={openSection === i}
                onToggle={() => setOpenSection(openSection === i ? null : i)}
                form={form}
                onChange={handleChange}
                isSaved={isSaved}
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isSaved}
            className={`mt-6 w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-base transition-all duration-200
              ${isLoading || isSaved
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-200 active:scale-[0.99]'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                {icons.download}
                Save Record &amp; Download PDF
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 Your data is encrypted and stored securely. Only you can access your records.
          </p>
        </form>
      </div>
    </div>
  );
}