import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  // 1️⃣ Personal Identification
  fullName: String,
  dob: String,
  gender: String,
  nationality: String,
  contactNumber: String,
  email: String,
  address: String,
  emergencyContact: String,

  // 2️⃣ Medical History
  chronicConditions: String,
  pastSurgeries: String,
  pastHospitalizations: String,
  currentMedications: String,
  allergies: String,
  familyHistory: String,
  vaccinationHistory: String,

  // 3️⃣ Lifestyle & Habits
  smokingStatus: String,
  alcoholConsumption: String,
  drugUse: String,
  exerciseFrequency: String,
  diet: String,
  sleepPatterns: String,

  // 4️⃣ Symptoms & Complaints
  onsetDate: String,
  symptomDescription: String,
  severity: String,
  duration: String,
  triggers: String,

  // 5️⃣ Vitals
  height: String,
  weight: String,
  bmi: String,
  bloodPressure: String,
  heartRate: String,
  respiratoryRate: String,
  bodyTemperature: String,
  bloodOxygen: String,

  // 6️⃣ Reproductive Health
  menstrualHistory: String,
  pregnancyStatus: String,
  contraceptiveUse: String,
  sexualActivity: String,
  stdHistory: String,

  // 7️⃣ Mental Health
  mood: String,
  stressLevel: String,
  sleepQuality: String,
  anxietyDepression: String,
  psychiatricHistory: String,
  currentTherapy: String,

  // 8️⃣ Insurance
  insuranceProvider: String,
  policyNumber: String,
  groupNumber: String,
  primaryInsured: String,
  billingAddress: String,

  // 9️⃣ Consent
  consentToTreat: Boolean,
  dataSharingConsent: Boolean,
  signature: String,

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TrackRecord || mongoose.model("TrackRecord", TrackSchema);
