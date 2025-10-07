//app/save-track/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

export default function SaveTrackPage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [openSection, setOpenSection] = useState(null);
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
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (name === 'height' || name === 'weight') {
      const h = form.height || (name === 'height' ? value : '');
      const w = form.weight || (name === 'weight' ? value : '');
      if (h && w) {
        const bmi = (w / ((h / 100) ** 2)).toFixed(2);
        setForm((prev) => ({ ...prev, bmi }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in first.');
    const payload = { ...form, userId: user.uid };

    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      alert('Record saved successfully!');
      generatePDF(payload);
      setForm({});
    } else alert('Error saving record.');
  };

  const generatePDF = (data) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 40;

    const addSection = (title, fields) => {
      doc.setFont('helvetica', 'bold');
      doc.text(title, 40, y);
      y += 20;
      doc.setFont('helvetica', 'normal');
      fields.forEach(([label, val]) => {
        if (val) {
          doc.text(`${label}: ${val}`, 60, y);
          y += 16;
        }
      });
      y += 10;
    };

    addSection('1. Personal Identification', [
      ['Full Name', data.fullName],
      ['DOB', data.dob],
      ['Gender', data.gender],
      ['Contact', data.contactNumber],
      ['Email', data.email],
      ['Address', data.address],
    ]);

    addSection('2. Medical History', [
      ['Chronic Conditions', data.chronicConditions],
      ['Surgeries', data.pastSurgeries],
      ['Hospitalizations', data.pastHospitalizations],
      ['Medications', data.currentMedications],
      ['Allergies', data.allergies],
    ]);

    addSection('3. Lifestyle & Habits', [
      ['Smoking', data.smokingStatus],
      ['Alcohol', data.alcoholConsumption],
      ['Diet', data.diet],
      ['Exercise', data.exerciseFrequency],
      ['Sleep', data.sleepPatterns],
    ]);

    addSection('4. Symptoms', [
      ['Description', data.symptomDescription],
      ['Severity', data.severity],
      ['Duration', data.duration],
      ['Triggers', data.triggers],
    ]);

    addSection('5. Vitals', [
      ['Height', data.height],
      ['Weight', data.weight],
      ['BMI', data.bmi],
      ['Blood Pressure', data.bloodPressure],
      ['Heart Rate', data.heartRate],
    ]);

    addSection('8. Insurance', [
      ['Provider', data.insuranceProvider],
      ['Policy No', data.policyNumber],
      ['Primary Insured', data.primaryInsured],
    ]);

    doc.save(`${data.fullName || 'Medical_Record'}.pdf`);
  };

  const sections = [
    {
      title: '1️⃣ Personal Identification',
      fields: [
        ['fullName', 'Full Name'],
        ['dob', 'Date of Birth'],
        ['gender', 'Gender / Sex'],
        ['nationality', 'Nationality'],
        ['contactNumber', 'Contact Number'],
        ['email', 'Email Address'],
        ['address', 'Address'],
        ['emergencyContact', 'Emergency Contact Info'],
      ],
    },
    {
      title: '2️⃣ Medical History',
      fields: [
        ['chronicConditions', 'Chronic Conditions'],
        ['pastSurgeries', 'Past Surgeries'],
        ['pastHospitalizations', 'Past Hospitalizations'],
        ['currentMedications', 'Current Medications'],
        ['allergies', 'Allergies'],
        ['familyHistory', 'Family History'],
        ['vaccinationHistory', 'Vaccination History'],
      ],
    },
    {
      title: '3️⃣ Lifestyle & Habits',
      fields: [
        ['smokingStatus', 'Smoking Status'],
        ['alcoholConsumption', 'Alcohol Consumption'],
        ['drugUse', 'Drug Use'],
        ['exerciseFrequency', 'Exercise Frequency'],
        ['diet', 'Diet'],
        ['sleepPatterns', 'Sleep Patterns'],
      ],
    },
    {
      title: '4️⃣ Symptoms & Present Complaints',
      fields: [
        ['onsetDate', 'Date of Onset'],
        ['symptomDescription', 'Symptom Description'],
        ['severity', 'Severity'],
        ['duration', 'Duration'],
        ['triggers', 'Triggers / Relievers'],
      ],
    },
    {
      title: '5️⃣ Vitals & Measurements',
      fields: [
        ['height', 'Height (cm)'],
        ['weight', 'Weight (kg)'],
        ['bmi', 'BMI (auto)'],
        ['bloodPressure', 'Blood Pressure'],
        ['heartRate', 'Heart Rate'],
        ['respiratoryRate', 'Respiratory Rate'],
        ['bodyTemperature', 'Body Temperature'],
        ['bloodOxygen', 'SpO2'],
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Medical Save & Track</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {sections.map((sec, i) => (
            <div key={i} className="border rounded-lg p-4">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === i ? null : i)}
                className="w-full flex justify-between items-center text-lg font-semibold"
              >
                {sec.title}
                <span>{openSection === i ? '−' : '+'}</span>
              </button>
              {openSection === i && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sec.fields.map(([name, label]) => (
                    <div key={name}>
                      <label className="block text-sm font-medium mb-1">{label}</label>
                      <input
                        type="text"
                        name={name}
                        value={form[name] || ''}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Save & Generate PDF
          </button>
        </form>
      </div>
    </div>
  );
}
