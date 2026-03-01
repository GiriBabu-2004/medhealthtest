import json

def create_complete_medical_dataset(output_file="docs_medical_complete.jsonl"):
    """Create a comprehensive medical dataset with all important sections"""
    
    complete_medical_data = [
        # PARACETAMOL
        {
            "drug_name": "Paracetamol",
            "section": ["indications", "usage", "uses"],
            "text": "Paracetamol (also known as acetaminophen) is indicated for the relief of mild to moderate pain such as headache, toothache, backache, menstrual cramps, muscle aches, and arthritis pain, and for the reduction of fever. It works by inhibiting prostaglandin synthesis in the central nervous system, reducing pain and regulating body temperature.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Paracetamol",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults and children 12 years and older: Take 500–1000 mg every 4 to 6 hours as needed, not exceeding 4000 mg in 24 hours. For children under 12 years: The dose is typically 10–15 mg/kg every 4 to 6 hours as needed, not exceeding 60 mg/kg/day or 5 doses in 24 hours.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Paracetamol",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Paracetamol is generally well tolerated. Possible side effects include nausea, rash, and allergic reactions. Serious but rare risks include liver damage, especially with overdose or prolonged use, and very rarely, severe skin reactions such as Stevens–Johnson syndrome.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Paracetamol",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Paracetamol should not be used by individuals with known hypersensitivity to acetaminophen or any component of the formulation, or by patients with severe liver disease. Caution should be used in patients with chronic alcohol use or impaired renal function.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Paracetamol",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Paracetamol overdose can cause severe, potentially fatal liver failure. Patients should avoid using multiple products containing paracetamol to prevent accidental overdose. Alcohol consumption increases the risk of liver toxicity. Use caution in long-term or high-dose use.",
            "source": "Medical_Reference"
        },

        # ASPIRIN
        {
            "drug_name": "Aspirin",
            "section": ["indications", "usage", "uses"],
            "text": "Aspirin is indicated for the relief of mild to moderate pain, reduction of fever, and management of inflammatory conditions such as rheumatoid arthritis and osteoarthritis. It is also used in low doses to reduce the risk of myocardial infarction, stroke, and other cardiovascular events due to its antiplatelet effects.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Aspirin",
            "section": ["dosage", "directions", "how to use"],
            "text": "For pain or fever in adults: 325–650 mg every 4–6 hours as needed, not exceeding 4 g/day. For cardiovascular prevention: 75–325 mg once daily. For children: Aspirin is generally not recommended due to the risk of Reye’s syndrome, especially in viral infections.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Aspirin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include gastrointestinal upset, nausea, heartburn, and bleeding tendency. Serious risks include gastrointestinal bleeding, peptic ulcers, allergic reactions, bronchospasm in asthmatic patients, kidney impairment, and increased risk of hemorrhagic stroke.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Aspirin",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Aspirin should not be used in patients with hypersensitivity to aspirin or other NSAIDs, active peptic ulcer disease, bleeding disorders, or history of aspirin-induced asthma. It is contraindicated in children and teenagers with viral infections due to the risk of Reye’s syndrome, and should be avoided in late pregnancy.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Aspirin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Long-term use of aspirin increases the risk of gastrointestinal bleeding and ulcers. It may also interact with anticoagulants, corticosteroids, and alcohol, further increasing bleeding risk. Patients should not stop low-dose aspirin therapy for cardiovascular protection without consulting their physician.",
            "source": "Medical_Reference"
        },

        # IBUPROFEN
        {
            "drug_name": "Ibuprofen",
            "section": ["indications", "usage", "uses"],
            "text": "Ibuprofen is indicated for relief of the signs and symptoms of rheumatoid arthritis and osteoarthritis, for relief of mild to moderate pain, and for reduction of fever. It is a nonsteroidal anti-inflammatory drug (NSAID) that works by reducing hormones that cause inflammation and pain in the body.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Ibuprofen",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults and children 12 years and older: Take 200-400 mg every 4 to 6 hours as needed. Do not exceed 1200 mg in 24 hours for over-the-counter use, or 3200 mg daily for prescription use. For children 6 months to 12 years: Dosing is typically based on weight, 5-10 mg/kg every 6-8 hours. Do not exceed 40 mg/kg/day.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Ibuprofen",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include stomach upset, nausea, vomiting, headache, diarrhea, constipation, dizziness, and drowsiness. Serious side effects may include stomach bleeding, kidney problems, liver damage, high blood pressure, heart failure, and increased risk of heart attack or stroke.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Ibuprofen",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Ibuprofen should not be used by patients with known hypersensitivity to ibuprofen or other NSAIDs, active peptic ulcer disease, or severe heart failure. Avoid during the third trimester of pregnancy. Use caution in patients with history of GI bleeding, kidney disease, or heart disease.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Ibuprofen",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "NSAIDs may increase the risk of serious cardiovascular thrombotic events, heart attack, and stroke, which can be fatal. This risk may increase with duration of use. NSAIDs also cause gastrointestinal bleeding, ulceration, and perforation, which can be fatal and occur without warning.",
            "source": "Medical_Reference"
        },
        
        # ACETAMINOPHEN
        {
            "drug_name": "Acetaminophen",
            "section": ["indications", "usage", "uses"],
            "text": "Acetaminophen is indicated for the temporary relief of minor aches and pains due to headache, muscular aches, backache, minor pain of arthritis, common cold, toothache, and menstrual cramps. It is also indicated for the reduction of fever.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Acetaminophen",
            "section": ["dosage", "directions", "how to use"],
            "text": "Adults and children 12 years and over: 325-650 mg every 4-6 hours as needed. Do not exceed 3000 mg in 24 hours. Children 6-11 years: 325 mg every 4-6 hours, not to exceed 1625 mg in 24 hours. For children under 6, consult a healthcare provider. Extended-release: 650 mg every 8 hours, not to exceed 1950 mg in 24 hours.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Acetaminophen",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Liver warning: This product contains acetaminophen. Severe liver damage may occur if you take more than 4000 mg of acetaminophen in 24 hours, with other drugs containing acetaminophen, or with 3 or more alcoholic drinks every day while using this product. Do not exceed recommended dosage_or_directions_or_how to use.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Acetaminophen",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Acetaminophen is generally well tolerated when used as directed. Rare but serious adverse reactions include severe skin reactions (Stevens-Johnson syndrome, toxic epidermal necrolysis), liver toxicity with overdose, and hypersensitivity reactions including anaphylaxis.",
            "source": "Medical_Reference"
        },
        
        # METFORMIN
        {
            "drug_name": "Metformin",
            "section": ["indications", "usage", "uses"],
            "text": "Metformin is indicated as an adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes mellitus. It may be used as monotherapy or in combination with other antidiabetic agents, including insulin.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Metformin",
            "section": ["dosage", "directions", "how to use"],
            "text": "Initial dose: 500 mg twice daily with meals or 850 mg once daily with the evening meal. May gradually increase by 500 mg weekly or 850 mg every 2 weeks based on glycemic response and tolerability. Maximum dose: 2550 mg daily in divided doses. Extended-release: Start with 500-1000 mg once daily with evening meal, may increase by 500 mg weekly up to 2000 mg daily.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Metformin",
            "section": ["mechanism of action", "how it works", "pharmacology"],
            "text": "Metformin decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity by increasing peripheral glucose uptake and utilization. Unlike sulfonylureas, metformin does not produce hypoglycemia in either patients with type 2 diabetes or normal subjects.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Metformin",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Severe renal disease (eGFR <30 mL/min/1.73 m²), acute or chronic metabolic acidosis including diabetic ketoacidosis, hypersensitivity to metformin, and acute conditions with risk of tissue hypoxia (such as cardiovascular collapse, acute myocardial infarction, and sepsis).",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Metformin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Most common adverse reactions include diarrhea, nausea, vomiting, flatulence, asthenia, indigestion, abdominal discomfort, and headache. These gastrointestinal symptoms are usually transient and related to initiation of therapy. Lactic acidosis is a rare but serious metabolic complication.",
            "source": "Medical_Reference"
        },
        
        # LISINOPRIL
        {
            "drug_name": "Lisinopril",
            "section": ["indications", "usage", "uses"],
            "text": "Lisinopril is indicated for the treatment of hypertension in adults and pediatric patients 6 years of age and older to lower blood pressure. It is also indicated as adjunctive therapy in the management of heart failure and to improve survival after acute myocardial infarction in clinically stable patients.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Lisinopril",
            "section": ["dosage", "directions", "how to use"],
            "text": "Hypertension: Initial dose 10 mg once daily. Usual maintenance dose 20-40 mg once daily. Maximum dose 80 mg daily. Heart failure: Initial dose 5 mg once daily, may increase to 20-40 mg daily. Post-myocardial infarction: Start with 5 mg, then 5 mg after 24 hours, then 10 mg daily, targeting 10 mg once daily.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Lisinopril",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Hypersensitivity to lisinopril or any component of the product. History of angioedema related to previous ACE inhibitor treatment. Hereditary or idiopathic angioedema. Co-administration with aliskiren in patients with diabetes. Pregnancy (can cause fetal toxicity).",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Lisinopril",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common adverse reactions include cough (dry, persistent), hypotension, chest pain, nausea, fatigue, dizziness, headache, elevated serum creatinine, and hyperkalemia. Serious reactions include angioedema, hypotension, and renal dysfunction.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Lisinopril",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Angioedema can occur at any time during treatment and may be life-threatening. Hypotension may occur, especially in volume-depleted patients. Monitor renal function and serum potassium levels. Can cause fetal toxicity when administered to pregnant women.",
            "source": "Medical_Reference"
        },
        
        # ATORVASTATIN
        {
            "drug_name": "Atorvastatin",
            "section": ["indications", "usage", "uses"],
            "text": "Atorvastatin is indicated to reduce the risk of cardiovascular events in adult patients with multiple risk factors for coronary heart disease and to treat dyslipidemias by reducing total cholesterol, LDL-C, apolipoprotein B, and triglycerides while raising HDL-C.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Atorvastatin",
            "section": ["dosage", "directions", "how to use"],
            "text": "Initial dose: 10-20 mg once daily. May increase to 40-80 mg once daily based on LDL-C response and cardiovascular risk. Take with or without food, preferably in the evening. Dosage_or_directions_or_how to use range: 10-80 mg daily. Maximum dose: 80 mg daily. Adjust dose based on lipid levels and patient response.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Atorvastatin",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Hypersensitivity to atorvastatin or any component of the medication. Active liver disease, including unexplained persistent elevations of hepatic transaminases. Pregnancy and breastfeeding. Concomitant administration with strong CYP3A4 inhibitors.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Atorvastatin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common adverse reactions include nasopharyngitis, arthralgia, diarrhea, pain in extremity, urinary tract infection, dyspepsia, nausea, and muscle spasms. Laboratory abnormalities include elevated liver enzymes and creatine kinase.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Atorvastatin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Myopathy and rhabdomyolysis can occur, especially at higher doses and with certain drug interactions. Monitor for muscle pain, tenderness, or weakness. Liver enzyme abnormalities can occur; monitor liver function tests. Diabetes mellitus may develop in predisposed patients.",
            "source": "Medical_Reference"
        },

        # OMEPRAZOLE
        {
            "drug_name": "Omeprazole",
            "section": ["indications", "usage", "uses"],
            "text": "Omeprazole is a proton pump inhibitor (PPI) indicated for the treatment of gastroesophageal reflux disease (GERD), duodenal ulcers, gastric ulcers, erosive esophagitis, and Zollinger–Ellison syndrome. It is also used in combination with antibiotics for the eradication of Helicobacter pylori infection.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Omeprazole",
            "section": ["dosage", "directions", "how to use"],
            "text": "For GERD and erosive esophagitis: Adults typically take 20 mg once daily for 4–8 weeks. For duodenal ulcers: 20 mg once daily for up to 4 weeks. For Zollinger–Ellison syndrome: Initial dose is 60 mg daily, adjusted as needed. Pediatric dosing is based on age and weight, usually 5–20 mg once daily. Omeprazole should be taken before meals.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Omeprazole",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include headache, abdominal pain, nausea, diarrhea, vomiting, and flatulence. Serious but rare side effects include vitamin B12 deficiency, hypomagnesemia, increased risk of bone fractures with long-term use, kidney problems, and Clostridium difficile infection.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Omeprazole",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Omeprazole should not be used in patients with known hypersensitivity to omeprazole, other proton pump inhibitors, or any component of the formulation. Caution should be used in patients with severe liver disease and those taking medications that interact with omeprazole such as clopidogrel, warfarin, or certain antifungals.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Omeprazole",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Prolonged use of omeprazole may increase the risk of gastric cancer, osteoporosis-related fractures, kidney disease, and micronutrient deficiencies (such as magnesium, calcium, and vitamin B12). Patients should use the lowest effective dose for the shortest duration possible. Regular monitoring is advised in long-term users.",
            "source": "Medical_Reference"
        },

        # AMLODIPINE
        {
            "drug_name": "Amlodipine",
            "section": ["indications", "usage", "uses"],
            "text": "Amlodipine is a calcium channel blocker indicated for the treatment of hypertension, chronic stable angina, and vasospastic (Prinzmetal’s) angina. It helps lower blood pressure, reducing the risk of stroke, heart attack, and kidney problems, and improves exercise tolerance in patients with angina.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amlodipine",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults with hypertension or angina: The usual initial dose is 5 mg once daily, which may be increased to a maximum of 10 mg daily depending on patient response. For elderly or patients with liver impairment: Start with 2.5 mg once daily. For children 6–17 years: 2.5–5 mg once daily.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amlodipine",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include swelling of ankles/feet (edema), flushing, dizziness, headache, fatigue, and palpitations. Less common but serious risks include severe hypotension, worsening angina or myocardial infarction in patients with severe coronary artery disease, and liver enzyme abnormalities.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amlodipine",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Amlodipine should not be used in patients with known hypersensitivity to amlodipine or other dihydropyridine calcium channel blockers. Caution is required in patients with severe hypotension, cardiogenic shock, severe aortic stenosis, or heart failure with reduced ejection fraction.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amlodipine",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Amlodipine may cause peripheral edema, especially at higher doses. It should be used cautiously in patients with liver impairment due to reduced drug clearance. Sudden withdrawal should be avoided as it may worsen angina. Monitoring blood pressure regularly is recommended during treatment.",
            "source": "Medical_Reference"
        },

        # SIMVASTATIN
        {
            "drug_name": "Simvastatin",
            "section": ["indications", "usage", "uses"],
            "text": "Simvastatin is a lipid-lowering medication (statin) indicated for the treatment of hypercholesterolemia, mixed dyslipidemia, and hypertriglyceridemia. It is used to reduce total cholesterol, LDL cholesterol, triglycerides, and to increase HDL cholesterol. It is also prescribed to reduce the risk of cardiovascular events such as heart attack, stroke, and the need for revascularization procedures.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Simvastatin",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults with hypercholesterolemia: The usual starting dose is 10–20 mg once daily in the evening. For patients requiring a large reduction in LDL cholesterol (>45%): 40 mg once daily in the evening. Maximum dose: 40 mg/day (80 mg only for patients who have been stable on this dose long-term without muscle toxicity). Pediatric dosing (10–17 years): 10–40 mg once daily in the evening.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Simvastatin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include headache, abdominal pain, constipation, nausea, and muscle pain. Serious risks include myopathy, rhabdomyolysis, and liver enzyme abnormalities. Rarely, hypersensitivity reactions such as rash, pruritus, and angioedema may occur.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Simvastatin",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Simvastatin is contraindicated in patients with active liver disease, unexplained persistent elevations of liver enzymes, pregnancy, and breastfeeding. It should not be used with strong CYP3A4 inhibitors (such as itraconazole, ketoconazole, erythromycin, clarithromycin, HIV protease inhibitors) due to increased risk of myopathy and rhabdomyolysis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Simvastatin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Patients should report any unexplained muscle pain, tenderness, or weakness, as this may indicate myopathy. Liver function tests should be performed before starting therapy and periodically thereafter. Grapefruit juice should be avoided as it increases simvastatin levels and the risk of muscle toxicity. Use the lowest effective dose to minimize risks.",
            "source": "Medical_Reference"
        },

        # LOSARTAN
        {
            "drug_name": "Losartan",
            "section": ["indications", "usage", "uses"],
            "text": "Losartan is an angiotensin II receptor blocker (ARB) indicated for the treatment of hypertension in adults and children over 6 years, reduction of stroke risk in patients with hypertension and left ventricular hypertrophy, and management of diabetic nephropathy in type 2 diabetes with proteinuria. It helps lower blood pressure and protects the kidneys and heart.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Losartan",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults with hypertension: The usual starting dose is 50 mg once daily, which may be increased to 100 mg daily depending on response. For patients with possible intravascular volume depletion or liver impairment: Start with 25 mg once daily. For children (6–16 years): 0.7 mg/kg once daily (up to 50 mg). It may be taken with or without food.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Losartan",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include dizziness, fatigue, nasal congestion, and back pain. Less common but serious risks include hyperkalemia, kidney function impairment, hypotension, and rare allergic reactions. In patients with diabetes, combining losartan with aliskiren may increase adverse effects.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Losartan",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Losartan is contraindicated in patients with known hypersensitivity to losartan or any component of the formulation. It should not be used during pregnancy due to risk of fetal toxicity. Caution is required in patients with severe liver impairment, renal artery stenosis, or history of angioedema.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Losartan",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Losartan may cause kidney function deterioration, particularly in patients with pre-existing kidney disease or those taking NSAIDs. Serum potassium and renal function should be monitored regularly. It should not be used in combination with aliskiren in patients with diabetes. Sudden withdrawal of therapy should be avoided.",
            "source": "Medical_Reference"
        },

        # HYDROCHLOROTHIAZIDE
        {
            "drug_name": "Hydrochlorothiazide",
            "section": ["indications", "usage", "uses"],
            "text": "Hydrochlorothiazide is a thiazide diuretic indicated for the treatment of hypertension and edema associated with congestive heart failure, hepatic cirrhosis, corticosteroid and estrogen therapy, or renal dysfunction such as chronic kidney disease and nephrotic syndrome. It works by increasing sodium and water excretion through the kidneys, reducing blood pressure and fluid retention.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Hydrochlorothiazide",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults with hypertension: 12.5–25 mg once daily, which may be increased up to 50 mg daily. For edema: 25–100 mg daily in single or divided doses. Pediatric dose: 1–2 mg/kg once or twice daily, not exceeding 37.5 mg daily for children under 2 years or 100 mg daily for older children. It is best taken in the morning to avoid nighttime urination.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Hydrochlorothiazide",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include increased urination, dizziness, weakness, photosensitivity, and gastrointestinal upset. Electrolyte disturbances such as hypokalemia, hyponatremia, hypomagnesemia, and hypercalcemia may occur. Other risks include hyperuricemia (gout), hyperglycemia, and rare allergic reactions.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Hydrochlorothiazide",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Hydrochlorothiazide is contraindicated in patients with anuria, hypersensitivity to hydrochlorothiazide or other sulfonamide-derived drugs. Caution is needed in patients with severe renal or hepatic impairment, gout, diabetes, or electrolyte imbalances.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Hydrochlorothiazide",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Hydrochlorothiazide may cause electrolyte imbalance, dehydration, or low blood pressure, especially in elderly patients or those on combination antihypertensive therapy. Periodic monitoring of electrolytes, renal function, and blood pressure is recommended. Patients should use sunscreen due to increased risk of photosensitivity.",
            "source": "Medical_Reference"
        },

        # GABAPENTIN
        {
            "drug_name": "Gabapentin",
            "section": ["indications", "usage", "uses"],
            "text": "Gabapentin is an anticonvulsant and neuropathic pain agent. It is indicated for the treatment of partial seizures (with or without secondary generalization), postherpetic neuralgia, and neuropathic pain conditions. It is also sometimes used off-label for restless legs syndrome, anxiety disorders, and migraine prophylaxis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Gabapentin",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults with epilepsy: Start with 300 mg once on day 1, then 300 mg twice daily on day 2, then 300 mg three times daily on day 3; the dose may be titrated up to 1800–3600 mg daily in divided doses. For postherpetic neuralgia: Start with 300 mg once daily, titrate up to 1800 mg/day as tolerated. Pediatric epilepsy dosing is weight-based. Gabapentin should be taken consistently with or without food.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Gabapentin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include dizziness, drowsiness, fatigue, ataxia, and peripheral edema. Less common risks include blurred vision, tremor, weight gain, and mood changes. Serious but rare risks include suicidal thoughts, severe hypersensitivity reactions, and respiratory depression (especially when combined with opioids).",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Gabapentin",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Gabapentin should not be used in patients with known hypersensitivity to gabapentin or its components. Caution is required in patients with renal impairment, respiratory disorders, or a history of depression and suicidal ideation.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Gabapentin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Abrupt discontinuation of gabapentin may increase the risk of seizures or withdrawal symptoms; tapering is recommended. Patients should be monitored for mood or behavior changes, including depression and suicidal thoughts. Dose adjustments are required in renal impairment. Concomitant use with CNS depressants, including opioids, may increase the risk of respiratory depression and sedation.",
            "source": "Medical_Reference"
        },

        # SERTRALINE
        {
            "drug_name": "Sertraline",
            "section": ["indications", "usage", "uses"],
            "text": "Sertraline is a selective serotonin reuptake inhibitor (SSRI) indicated for the treatment of major depressive disorder, panic disorder, obsessive-compulsive disorder (OCD), post-traumatic stress disorder (PTSD), social anxiety disorder, and premenstrual dysphoric disorder (PMDD). It helps restore the balance of serotonin in the brain to improve mood, sleep, and energy levels.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Sertraline",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults with depression and OCD: The usual starting dose is 50 mg once daily, which may be increased at weekly intervals up to a maximum of 200 mg/day. For panic disorder, PTSD, and social anxiety disorder: Start at 25 mg once daily, then increase to 50 mg after one week, adjusting as needed. For PMDD: 50–150 mg daily, either continuously or during the luteal phase. Pediatric dosing (6–17 years) for OCD: Start at 25–50 mg daily, titrated up as needed.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Sertraline",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include nausea, diarrhea, insomnia, dry mouth, fatigue, dizziness, and sexual dysfunction. Serious risks include serotonin syndrome (especially when combined with other serotonergic drugs), increased risk of suicidal thoughts in young adults and children, hyponatremia, and withdrawal symptoms if discontinued abruptly.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Sertraline",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Sertraline is contraindicated in patients with hypersensitivity to sertraline or its components, and in those taking monoamine oxidase inhibitors (MAOIs) or pimozide due to risk of serious drug interactions. Caution is required in patients with liver impairment, seizure disorders, bipolar disorder, or bleeding disorders.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Sertraline",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Sertraline may increase the risk of suicidal thoughts and behaviors, particularly in young adults, adolescents, and children. Patients should be closely monitored during initiation and dose adjustments. It may cause serotonin syndrome when combined with other serotonergic agents. Gradual tapering is recommended when discontinuing. Alcohol should be avoided due to additive CNS effects.",
            "source": "Medical_Reference"
        },

        # TRAMADOL
        {
            "drug_name": "Tramadol",
            "section": ["indications", "usage", "uses"],
            "text": "Tramadol is an opioid analgesic indicated for the management of moderate to moderately severe pain, both acute and chronic. It works by binding to μ-opioid receptors and inhibiting the reuptake of norepinephrine and serotonin, altering pain perception in the central nervous system.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Tramadol",
            "section": ["dosage", "directions", "how to use"],
            "text": "For adults: Immediate-release tablets: 50–100 mg every 4–6 hours as needed for pain, not exceeding 400 mg/day. Extended-release formulations: 100 mg once daily, titrated as needed up to 300 mg/day. For elderly (over 75 years): Maximum 300 mg/day. Pediatric use is generally not recommended due to risk of respiratory depression.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Tramadol",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include dizziness, drowsiness, headache, nausea, vomiting, constipation, and dry mouth. Serious risks include seizures, serotonin syndrome (especially when combined with SSRIs, SNRIs, or MAOIs), respiratory depression, dependence, and addiction. Overdose may be fatal.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Tramadol",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Tramadol is contraindicated in patients with hypersensitivity to tramadol or opioids, acute intoxication with alcohol or CNS depressants, severe respiratory depression, and in children under 12 years. It should not be used in patients who are taking or have recently taken MAO inhibitors. Caution is required in patients with seizure disorders or history of substance abuse.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Tramadol",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Tramadol carries a risk of dependence, abuse, and addiction. It may cause life-threatening respiratory depression, particularly when combined with other CNS depressants. Risk of seizures increases with higher doses or concomitant use of drugs that lower the seizure threshold. Serotonin syndrome may occur with other serotonergic drugs. Patients should avoid alcohol, and tapering is recommended when discontinuing to prevent withdrawal symptoms.",
            "source": "Medical_Reference"
        },

        # MORPHINE
        {
            "drug_name": "Morphine",
            "section": ["indications", "usage", "uses"],
            "text": "Morphine is a strong opioid analgesic indicated for the relief of moderate to severe acute and chronic pain, including postoperative pain, cancer pain, and pain associated with myocardial infarction. It is also used for palliative care and as a pre-anesthetic medication. It works by binding to μ-opioid receptors in the central nervous system, altering the perception of and response to pain.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Morphine",
            "section": ["dosage", "directions", "how to use"],
            "text": "Dosage should be individualized based on pain severity, patient response, and prior opioid exposure. For opioid-naïve adults: Oral immediate-release morphine: 10–30 mg every 4 hours as needed. Extended-release formulations: 15–30 mg every 8–12 hours, titrated as necessary. Parenteral (IV/IM/SC): 2.5–10 mg every 2–4 hours as needed. No absolute maximum dose exists, but titration should be cautious due to risk of respiratory depression. Pediatric dosing is weight-based.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Morphine",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include drowsiness, dizziness, nausea, vomiting, constipation, sweating, and itching. Serious risks include respiratory depression, hypotension, bradycardia, confusion, urinary retention, dependence, tolerance, and addiction. Long-term use may result in opioid use disorder. Overdose can be fatal.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Morphine",
            "section": ["contradictions", "who should not take", "not recommended for"],
            "text": "Morphine is contraindicated in patients with hypersensitivity to opioids, severe respiratory depression, acute or severe bronchial asthma, paralytic ileus, and head injury due to risk of increased intracranial pressure. Caution should be used in patients with renal or hepatic impairment, elderly patients, and those with substance use disorders.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Morphine",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Morphine carries a high risk of abuse, dependence, and addiction. It may cause life-threatening respiratory depression, particularly at treatment initiation or dose escalation. Naloxone should be available for overdose reversal. Concomitant use with alcohol, benzodiazepines, or other CNS depressants increases the risk of fatal overdose. Gradual tapering is recommended when discontinuing therapy to prevent withdrawal symptoms.",
            "source": "Medical_Reference"
        },

        # Metoprolol
        {
            "drug_name": "Metoprolol",
            "section": ["indications", "usage", "uses"],
            "text": "Metoprolol is indicated for the treatment of hypertension, angina pectoris, and heart failure. It is also used to reduce the risk of cardiovascular mortality in patients after a heart attack, and for the management of arrhythmias and migraine prophylaxis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Metoprolol",
            "section": ["dosage", "directions", "how to use"],
            "text": "For hypertension: 50-100 mg once daily, which may be increased up to 400 mg per day depending on patient response. For angina: 100-400 mg daily in divided doses. For acute myocardial infarction: an initial IV dose followed by oral dosing is typically recommended. Dosage must be individualized based on clinical response.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Metoprolol",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include fatigue, dizziness, depression, bradycardia, and gastrointestinal upset. Serious adverse effects may include severe bradycardia, hypotension, heart block, worsening heart failure, and bronchospasm in susceptible patients.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Metoprolol",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Metoprolol is contraindicated in patients with severe bradycardia, second- or third-degree heart block, cardiogenic shock, overt cardiac failure, or known hypersensitivity to the drug. It should be used with caution in patients with asthma, COPD, diabetes, or peripheral vascular disease.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Metoprolol",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Abrupt discontinuation of metoprolol may exacerbate angina, cause rebound hypertension, or precipitate myocardial infarction. Dose reduction should be gradual over 1–2 weeks. Use with caution in patients with thyroid disorders, liver impairment, or those undergoing major surgery.",
            "source": "Medical_Reference"
        },

        #Atenolol
        {
            "drug_name": "Atenolol",
            "section": ["indications", "usage", "uses"],
            "text": "Atenolol is indicated for the treatment of hypertension, angina pectoris, and secondary prevention after myocardial infarction. It is also used in the management of arrhythmias and occasionally for migraine prophylaxis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Atenolol",
            "section": ["dosage", "directions", "how to use"],
            "text": "For hypertension: 25-50 mg once daily, which may be increased up to 100 mg daily if needed. For angina: 50-100 mg daily in 1–2 divided doses. For arrhythmias and post-MI use: dosing is individualized. Dosage should always be adjusted based on patient response and tolerability.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Atenolol",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include fatigue, dizziness, bradycardia, cold extremities, and gastrointestinal upset. Serious side effects may include severe bradycardia, heart block, hypotension, worsening of heart failure, and bronchospasm in susceptible patients.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Atenolol",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Atenolol is contraindicated in patients with sinus bradycardia, second- or third-degree heart block, cardiogenic shock, overt heart failure, or known hypersensitivity to the drug. Caution should be exercised in patients with asthma, COPD, diabetes, or peripheral vascular disease.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Atenolol",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Abrupt withdrawal of atenolol may worsen angina, cause rebound hypertension, or precipitate myocardial infarction. Tapering should be done gradually over 1–2 weeks. Use cautiously in patients with renal impairment, thyroid disorders, or those undergoing major surgery.",
            "source": "Medical_Reference"
        },

        #Clopidogrel
        {
            "drug_name": "Clopidogrel",
            "section": ["indications", "usage", "uses"],
            "text": "Clopidogrel is an antiplatelet medication indicated for the prevention of atherothrombotic events such as myocardial infarction, stroke, and vascular death in patients with recent MI, recent stroke, or established peripheral arterial disease. It is also used in acute coronary syndrome and after percutaneous coronary intervention (PCI) with stent placement.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Clopidogrel",
            "section": ["dosage", "directions", "how to use"],
            "text": "The usual dose is 75 mg once daily. For acute coronary syndrome: an initial loading dose of 300–600 mg is recommended, followed by 75 mg daily. Clopidogrel is often prescribed in combination with aspirin for dual antiplatelet therapy, as advised by a physician.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Clopidogrel",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include easy bruising, nosebleeds, diarrhea, and rash. Serious adverse effects may include gastrointestinal bleeding, intracranial hemorrhage, thrombotic thrombocytopenic purpura (TTP), and severe allergic reactions.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Clopidogrel",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Clopidogrel is contraindicated in patients with active pathological bleeding such as peptic ulcer or intracranial hemorrhage, and in those with known hypersensitivity to the drug. It should be avoided in severe hepatic impairment.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Clopidogrel",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Clopidogrel increases the risk of bleeding; caution is advised in patients undergoing surgery or those taking other anticoagulants or NSAIDs. Effectiveness may be reduced in patients who are poor metabolizers of CYP2C19. Discontinuation should be done under medical supervision.",
            "source": "Medical_Reference"
        },

        #Warfarin
        {
            "drug_name": "Warfarin",
            "section": ["indications", "usage", "uses"],
            "text": "Warfarin is an oral anticoagulant used for the prevention and treatment of thromboembolic disorders such as deep vein thrombosis (DVT), pulmonary embolism (PE), and for reducing the risk of stroke and systemic embolism in patients with atrial fibrillation or prosthetic heart valves.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Warfarin",
            "section": ["dosage", "directions", "how to use"],
            "text": "Warfarin dosing is individualized based on the patient's INR (International Normalized Ratio). The typical starting dose is 2–5 mg once daily, adjusted according to INR monitoring. Target INR is generally between 2.0–3.0, but may be higher (2.5–3.5) in patients with mechanical heart valves.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Warfarin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include easy bruising, bleeding gums, and nosebleeds. Serious risks include gastrointestinal bleeding, intracranial hemorrhage, skin necrosis, and purple toe syndrome. Long-term use may also cause osteoporosis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Warfarin",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Warfarin is contraindicated in patients with active bleeding, severe uncontrolled hypertension, pregnancy (risk of fetal harm), recent or upcoming surgery with high bleeding risk, and known hypersensitivity to warfarin or its components.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Warfarin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Warfarin requires regular INR monitoring to ensure safe and effective dosing. It has many drug and food interactions (especially foods high in vitamin K, such as leafy greens) that can alter its effectiveness. Patients should be educated about consistent dietary habits and the importance of adherence to monitoring.",
            "source": "Medical_Reference"
        },

        #Enalapril
        {
            "drug_name": "Enalapril",
            "section": ["indications", "usage", "uses"],
            "text": "Enalapril is an angiotensin-converting enzyme (ACE) inhibitor used to treat hypertension, heart failure, and asymptomatic left ventricular dysfunction. It may also be used to reduce the risk of developing heart failure in patients with certain cardiac conditions.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Enalapril",
            "section": ["dosage", "directions", "how to use"],
            "text": "For hypertension: The usual starting dose is 5 mg once daily, which may be increased to 10–40 mg daily in 1 or 2 divided doses. For heart failure: The initial dose is 2.5 mg twice daily, titrated up to 20 mg twice daily as tolerated. Dosage should be adjusted based on blood pressure response and kidney function.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Enalapril",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include cough, dizziness, fatigue, headache, and hypotension. Serious adverse reactions may include angioedema, hyperkalemia, kidney dysfunction, and severe hypotension, especially after the first dose in patients with heart failure or volume depletion.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Enalapril",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Enalapril is contraindicated in patients with a history of angioedema related to previous ACE inhibitor therapy, bilateral renal artery stenosis, or pregnancy. It should not be used in patients with known hypersensitivity to enalapril or other ACE inhibitors.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Enalapril",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Enalapril can cause hypotension, particularly after the initial dose. Kidney function and potassium levels should be monitored regularly. It should be discontinued if angioedema occurs. Use caution in patients with renal impairment, dehydration, or those taking potassium supplements or potassium-sparing diuretics.",
            "source": "Medical_Reference"
        },

        #Insulin
        {
            "drug_name": "Insulin",
            "section": ["indications", "usage", "uses"],
            "text": "Insulin is indicated for the treatment of type 1 diabetes mellitus and type 2 diabetes mellitus when oral medications are insufficient. It is also used in diabetic ketoacidosis, hyperosmolar hyperglycemic state, and sometimes in gestational diabetes. It helps regulate blood glucose levels by promoting uptake of glucose into cells and inhibiting hepatic glucose production.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Insulin",
            "section": ["dosage", "directions", "how to use"],
            "text": "Dosage is highly individualized based on blood glucose monitoring, type of insulin (rapid-acting, short-acting, intermediate-acting, long-acting), diet, and activity level. Typical total daily insulin requirement ranges from 0.5 to 1 unit/kg/day, divided into basal and bolus doses. Subcutaneous injection is the most common route, and continuous infusion via an insulin pump may also be used.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Insulin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "The most common adverse effect is hypoglycemia, which can cause sweating, dizziness, confusion, tremors, and, in severe cases, seizures or loss of consciousness. Other side effects include weight gain, injection site reactions, lipodystrophy, and, rarely, allergic reactions.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Insulin",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Insulin should not be used in patients experiencing hypoglycemia or in those with hypersensitivity to a specific insulin preparation. Extreme caution is required in patients with hypokalemia, as insulin can worsen potassium levels.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Insulin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Frequent blood glucose monitoring is required to avoid hypoglycemia and hyperglycemia. Dosage adjustments may be needed during illness, stress, changes in diet, or changes in physical activity. Combining insulin with other glucose-lowering medications increases the risk of hypoglycemia. Insulin requirements may change during pregnancy and lactation.",
            "source": "Medical_Reference"
        },

        #Glipizide
        {
            "drug_name": "Glipizide",
            "section": ["indications", "usage", "uses"],
            "text": "Glipizide is an oral sulfonylurea used to improve glycemic control in adults with type 2 diabetes mellitus. It stimulates the pancreas to release insulin and is typically prescribed when diet and exercise alone are insufficient to control blood glucose.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Glipizide",
            "section": ["dosage", "directions", "how to use"],
            "text": "The usual starting dose is 5 mg once daily, taken 30 minutes before breakfast. The dose may be adjusted based on blood glucose response, usually ranging from 2.5 mg to 20 mg per day. The maximum recommended daily dose is 40 mg, divided into two doses if needed.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Glipizide",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "The most common side effect is hypoglycemia, especially in elderly patients or those with renal impairment. Other side effects include dizziness, headache, nausea, diarrhea, weight gain, and, rarely, allergic skin reactions or blood disorders.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Glipizide",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Glipizide is contraindicated in patients with type 1 diabetes, diabetic ketoacidosis, severe liver or kidney disease, and known hypersensitivity to sulfonylureas or sulfonamides.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Glipizide",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Patients should be counseled about recognizing and treating hypoglycemia. Alcohol may increase the risk of low blood sugar. Long-term use may lead to secondary failure as pancreatic beta-cell function declines. Close monitoring is needed in elderly patients and those with hepatic or renal impairment.",
            "source": "Medical_Reference"
        },

        #Sitagliptin
        {
            "drug_name": "Sitagliptin",
            "section": ["indications", "usage", "uses"],
            "text": "Sitagliptin is an oral dipeptidyl peptidase-4 (DPP-4) inhibitor used to improve glycemic control in adults with type 2 diabetes mellitus. It works by increasing incretin levels, which help regulate insulin secretion and decrease glucose production.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Sitagliptin",
            "section": ["dosage", "directions", "how to use"],
            "text": "The usual dose is 100 mg once daily, with or without food. In patients with moderate renal impairment (eGFR 30–45 mL/min/1.73m²), the recommended dose is 50 mg once daily. For severe renal impairment or end-stage renal disease, the dose is reduced to 25 mg once daily.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Sitagliptin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include headache, upper respiratory tract infection, and nasopharyngitis. Rare but serious adverse effects include pancreatitis, severe joint pain, and hypersensitivity reactions such as angioedema and anaphylaxis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Sitagliptin",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Sitagliptin is contraindicated in patients with known hypersensitivity to sitagliptin or any component of the formulation. It is not indicated for type 1 diabetes mellitus or for the treatment of diabetic ketoacidosis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Sitagliptin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Use with caution in patients with a history of pancreatitis. Monitor renal function before and during treatment. Hypoglycemia risk increases when sitagliptin is used with insulin or sulfonylureas. Report persistent abdominal pain or hypersensitivity reactions immediately.",
            "source": "Medical_Reference"
        },

        #Diazepam
        {
            "drug_name": "Diazepam",
            "section": ["indications", "usage", "uses"],
            "text": "Diazepam is a benzodiazepine used for the management of anxiety disorders, muscle spasms, alcohol withdrawal symptoms, and as an adjunct for seizures. It is also used as a premedication for procedures to provide sedation and relieve anxiety.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Diazepam",
            "section": ["dosage", "directions", "how to use"],
            "text": "For anxiety: Adults typically take 2–10 mg orally, 2–4 times daily. For muscle spasms: 2–10 mg orally, 3–4 times daily. For alcohol withdrawal: 10 mg orally, 3–4 times in the first 24 hours, then 5 mg every 6–8 hours as needed. Dosage must be individualized and the lowest effective dose should be used.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Diazepam",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include drowsiness, fatigue, muscle weakness, and ataxia. Serious risks include respiratory depression, dependence, withdrawal symptoms, confusion, and paradoxical reactions such as increased anxiety or aggression.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Diazepam",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with known hypersensitivity to benzodiazepines, severe respiratory insufficiency, sleep apnea syndrome, myasthenia gravis, and acute narrow-angle glaucoma. Not recommended for use in infants under 6 months.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Diazepam",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Diazepam carries a risk of dependence, abuse, and withdrawal symptoms with prolonged use. Use with caution in elderly patients due to increased risk of falls and sedation. Concomitant use with opioids may cause profound sedation, respiratory depression, coma, and death. Avoid alcohol while taking diazepam.",
            "source": "Medical_Reference"
        },

        #Alprazolam
        {
            "drug_name": "Alprazolam",
            "section": ["indications", "usage", "uses"],
            "text": "Alprazolam is a benzodiazepine primarily used for the management of generalized anxiety disorder (GAD), panic disorder, and anxiety associated with depression. It provides short-term relief of symptoms of anxiety.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Alprazolam",
            "section": ["dosage", "directions", "how to use"],
            "text": "For anxiety disorders: Adults typically start with 0.25–0.5 mg orally three times daily. For panic disorder: Initial dose is usually 0.5 mg three times daily, which may be gradually increased. The maximum daily dose should not exceed 4 mg. Dose adjustments must be individualized, and the lowest effective dose used.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Alprazolam",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include drowsiness, dizziness, fatigue, memory impairment, and impaired coordination. Serious risks include dependence, withdrawal symptoms, depression, respiratory depression, and rare paradoxical reactions such as agitation or hyperactivity.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Alprazolam",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with hypersensitivity to benzodiazepines, acute narrow-angle glaucoma, and those taking strong CYP3A4 inhibitors such as ketoconazole and itraconazole. Not recommended for use in pregnancy or breastfeeding.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Alprazolam",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Alprazolam carries a high risk of dependence and withdrawal, especially with long-term use or high doses. Abrupt discontinuation may cause seizures. Concomitant use with opioids increases risk of sedation, respiratory depression, and death. Elderly patients are more sensitive to its sedative effects.",
            "source": "Medical_Reference"
        },

        #Fluoxetine
        {
            "drug_name": "Fluoxetine",
            "section": ["indications", "usage", "uses"],
            "text": "Fluoxetine is a selective serotonin reuptake inhibitor (SSRI) used to treat major depressive disorder (MDD), obsessive-compulsive disorder (OCD), bulimia nervosa, panic disorder, and premenstrual dysphoric disorder (PMDD).",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Fluoxetine",
            "section": ["dosage", "directions", "how to use"],
            "text": "For major depressive disorder and OCD: The usual adult starting dose is 20 mg orally once daily, which may be increased gradually. Maximum recommended dose is typically 80 mg/day. For bulimia nervosa: 60 mg/day. For panic disorder: initial dose of 10 mg/day, increased to 20 mg/day after one week. Dosing should be individualized.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Fluoxetine",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include nausea, headache, insomnia, anxiety, diarrhea, sexual dysfunction, and dry mouth. Serious risks include serotonin syndrome (when combined with other serotonergic drugs), suicidal ideation (especially in young adults), and QT prolongation.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Fluoxetine",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with hypersensitivity to fluoxetine, those taking monoamine oxidase inhibitors (MAOIs) or pimozide due to risk of serious interactions. Not recommended during use with thioridazine due to QT prolongation risk.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Fluoxetine",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Fluoxetine should be used cautiously in patients with seizure disorders, bipolar disorder (risk of mania), hepatic impairment, and those with history of suicidal ideation. Concomitant use with other serotonergic agents may increase risk of serotonin syndrome.",
            "source": "Medical_Reference"
        },

        #Amitriptyline
        {
            "drug_name": "Amitriptyline",
            "section": ["indications", "usage", "uses"],
            "text": "Amitriptyline is a tricyclic antidepressant (TCA) used to treat major depressive disorder, neuropathic pain, migraine prophylaxis, and sometimes insomnia due to its sedative properties.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amitriptyline",
            "section": ["dosage", "directions", "how to use"],
            "text": "For depression: the usual starting dose is 25–50 mg orally at bedtime, gradually increased to 75–150 mg/day in divided doses. For neuropathic pain or migraine prophylaxis: typically 10–25 mg at bedtime, adjusted as needed. Maximum daily dose may reach 300 mg under supervision.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amitriptyline",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include dry mouth, constipation, urinary retention, blurred vision, drowsiness, and weight gain. Serious risks include arrhythmias, seizures, and risk of overdose toxicity, which can be life-threatening.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amitriptyline",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with recent myocardial infarction, arrhythmias, severe liver disease, and hypersensitivity to TCAs. Should not be used concurrently with monoamine oxidase inhibitors (MAOIs).",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amitriptyline",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Caution is advised in elderly patients, those with cardiovascular disease, epilepsy, glaucoma, or urinary retention. Amitriptyline can increase risk of suicidal ideation in young adults and adolescents, especially early in treatment.",
            "source": "Medical_Reference"
        },

        #Haloperidol
        {
            "drug_name": "Haloperidol",
            "section": ["indications", "usage", "uses"],
            "text": "Haloperidol is a typical antipsychotic medication used to treat schizophrenia, acute psychosis, schizoaffective disorder, and severe behavioral problems. It is also used for Tourette syndrome and to control acute agitation or delirium.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Haloperidol",
            "section": ["dosage", "directions", "how to use"],
            "text": "Oral: For schizophrenia and psychosis, the usual starting dose is 0.5–5 mg two or three times daily, adjusted based on response. Intramuscular injection: 2–10 mg every 4–8 hours as needed for acute agitation. Maximum daily dose usually does not exceed 100 mg.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Haloperidol",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include extrapyramidal symptoms (muscle stiffness, tremors, restlessness), sedation, dry mouth, and blurred vision. Serious adverse effects include tardive dyskinesia, neuroleptic malignant syndrome, QT prolongation, and sudden cardiac death.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Haloperidol",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with severe CNS depression, Parkinson’s disease, hypersensitivity to haloperidol, and those with significant cardiac abnormalities (e.g., QT prolongation).",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Haloperidol",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Caution is required in elderly patients, particularly with dementia-related psychosis, due to increased risk of death. ECG monitoring is advised for patients at risk of cardiac arrhythmias. Use lowest effective dose to minimize long-term side effects.",
            "source": "Medical_Reference"
        },

        #Lithium
        {
            "drug_name": "Lithium",
            "section": ["indications", "usage", "uses"],
            "text": "Lithium is a mood stabilizer primarily used in the treatment and prevention of bipolar disorder, particularly for controlling acute manic episodes and reducing the risk of suicide. It is sometimes used as an adjunct in major depressive disorder.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Lithium",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult dose: 300–600 mg orally 2–3 times daily, adjusted to achieve therapeutic serum levels of 0.6–1.2 mEq/L for maintenance. Serum lithium levels must be checked regularly (usually every 3–6 months) to avoid toxicity.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Lithium",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include tremor, increased thirst, polyuria, nausea, weight gain, and cognitive slowing. Serious risks include lithium toxicity (manifesting as confusion, ataxia, seizures, and kidney damage), thyroid dysfunction, and arrhythmias.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Lithium",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with severe renal impairment, significant cardiovascular disease, dehydration, sodium depletion, and during pregnancy (especially the first trimester, due to teratogenic risk of Ebstein’s anomaly).",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Lithium",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Lithium has a very narrow therapeutic index. Regular monitoring of serum lithium levels, kidney function, and thyroid function is essential. Dehydration, diuretic use, and NSAIDs can increase risk of toxicity. Patients should maintain consistent salt and fluid intake.",
            "source": "Medical_Reference"
        },

        #Naproxen
        {
            "drug_name": "Naproxen",
            "section": ["indications", "usage", "uses"],
            "text": "Naproxen is a nonsteroidal anti-inflammatory drug (NSAID) used for relief of pain, inflammation, and stiffness caused by conditions such as osteoarthritis, rheumatoid arthritis, ankylosing spondylitis, gout, menstrual cramps, and acute musculoskeletal pain.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Naproxen",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult dose: 250–500 mg orally twice daily. For acute pain, an initial dose of 500 mg followed by 250 mg every 6–8 hours as needed may be given. Maximum daily dose usually does not exceed 1,250 mg on the first day, and 1,000 mg thereafter.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Naproxen",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include nausea, heartburn, abdominal pain, headache, and dizziness. Serious risks include gastrointestinal bleeding or ulcers, kidney impairment, hypertension, fluid retention, and increased risk of cardiovascular events (heart attack or stroke).",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Naproxen",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with a history of peptic ulcer disease or gastrointestinal bleeding, severe heart failure, hypersensitivity to NSAIDs (e.g., aspirin allergy), or those who have experienced asthma attacks after NSAID use.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Naproxen",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Long-term use should be at the lowest effective dose. Use with caution in patients with cardiovascular disease, kidney disease, or gastrointestinal disorders. Combining with alcohol, corticosteroids, or anticoagulants increases risk of GI bleeding. Should be avoided in late pregnancy due to risk of fetal harm.",
            "source": "Medical_Reference"
        },

        #Celecoxib
        {
            "drug_name": "Celecoxib",
            "section": ["indications", "usage", "uses"],
            "text": "Celecoxib is a selective COX-2 inhibitor nonsteroidal anti-inflammatory drug (NSAID) used to treat osteoarthritis, rheumatoid arthritis, ankylosing spondylitis, acute pain, dysmenorrhea, and juvenile rheumatoid arthritis. It provides anti-inflammatory and analgesic effects with reduced gastrointestinal side effects compared to traditional NSAIDs.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Celecoxib",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult dose: 100–200 mg orally once or twice daily, depending on the condition. Maximum recommended dose is 400 mg per day. For acute pain or dysmenorrhea, 400 mg initially followed by 200 mg if needed on the first day, then 200 mg twice daily as required.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Celecoxib",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include dyspepsia, diarrhea, abdominal pain, headache, and upper respiratory tract infections. Serious risks include cardiovascular events (heart attack, stroke), hypertension, kidney impairment, and rare but severe skin reactions.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Celecoxib",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with sulfonamide allergy, history of aspirin/NSAID-induced asthma or allergic reactions, active gastrointestinal bleeding, and in patients with recent coronary artery bypass graft (CABG) surgery.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Celecoxib",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Should be used with caution in patients with cardiovascular disease, hypertension, kidney disease, or liver impairment. Long-term use should be at the lowest effective dose. Avoid during late pregnancy (third trimester) due to risk of premature closure of the ductus arteriosus.",
            "source": "Medical_Reference"
        },

        #Codeine
        {
            "drug_name": "Codeine",
            "section": ["indications", "usage", "uses"],
            "text": "Codeine is an opioid analgesic used to relieve mild to moderate pain and as an antitussive to suppress coughing. It is often combined with other analgesics such as acetaminophen or aspirin for enhanced effect.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Codeine",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult dose for pain: 15–60 mg orally every 4–6 hours as needed, not exceeding 360 mg per day. For cough: 10–20 mg every 4–6 hours as needed, not exceeding 120 mg per day.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Codeine",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include drowsiness, constipation, dizziness, nausea, and vomiting. Serious risks include respiratory depression, dependence, tolerance, and in rare cases, life-threatening breathing problems especially in children or ultra-rapid CYP2D6 metabolizers.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Codeine",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in children under 12, postoperative pain management in children following tonsillectomy/adenoidectomy, patients with respiratory depression, severe asthma, or hypersensitivity to opioids.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Codeine",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Codeine has a high risk of abuse, dependence, and misuse. Should be used cautiously in elderly patients, those with liver/kidney impairment, or patients taking other CNS depressants. Avoid alcohol consumption during treatment.",
            "source": "Medical_Reference"
        },

        #Amoxicillin
        {
            "drug_name": "Amoxicillin",
            "section": ["indications", "usage", "uses"],
            "text": "Amoxicillin is a broad-spectrum penicillin antibiotic used to treat bacterial infections such as ear, nose, and throat infections, bronchitis, pneumonia, urinary tract infections, and skin infections. It is also used in combination with other drugs to treat Helicobacter pylori infection in peptic ulcer disease.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amoxicillin",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult dose: 250–500 mg orally every 8 hours or 500–875 mg every 12 hours, depending on the infection. Pediatric dosing is weight-based. Therapy duration usually ranges from 7–14 days.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amoxicillin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include nausea, diarrhea, rash, and headache. Rare but serious adverse reactions include severe allergic reactions (anaphylaxis), Stevens–Johnson syndrome, liver toxicity, and Clostridium difficile–associated diarrhea.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amoxicillin",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with hypersensitivity to penicillin antibiotics or cephalosporins, and those with a history of severe allergic reactions to beta-lactams.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Amoxicillin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Use with caution in patients with renal impairment, as dose adjustment may be necessary. Overuse or misuse may lead to antibiotic resistance. Patients should complete the full course even if symptoms improve.",
            "source": "Medical_Reference"
        },

        #Ciprofloxacin
        {
            "drug_name": "Ciprofloxacin",
            "section": ["indications", "usage", "uses"],
            "text": "Ciprofloxacin is a fluoroquinolone antibiotic used to treat bacterial infections such as urinary tract infections, respiratory tract infections, skin infections, gastrointestinal infections, bone and joint infections, and certain types of infectious diarrhea. It is also used for anthrax exposure prophylaxis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Ciprofloxacin",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult dose: 250–750 mg orally every 12 hours for 7–14 days depending on infection type. Intravenous dosing is also available. Doses must be adjusted in patients with kidney impairment.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Ciprofloxacin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include nausea, diarrhea, dizziness, and headache. Serious risks include tendon rupture, peripheral neuropathy, central nervous system effects (seizures, hallucinations), QT prolongation, and Clostridium difficile–associated diarrhea.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Ciprofloxacin",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with hypersensitivity to fluoroquinolones, children and adolescents (except in specific serious infections), and patients taking tizanidine due to severe interactions.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Ciprofloxacin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Ciprofloxacin carries a black box warning for tendon rupture and peripheral neuropathy. Should be avoided in pregnant or breastfeeding women unless absolutely necessary. Use with caution in patients with heart rhythm disorders, epilepsy, or kidney disease.",
            "source": "Medical_Reference"
        },

        #Azithromycin
        {
            "drug_name": "Azithromycin",
            "section": ["indications", "usage", "uses"],
            "text": "Azithromycin is a macrolide antibiotic used to treat respiratory tract infections, ear infections, skin infections, and sexually transmitted infections such as chlamydia. It is also used for Mycobacterium avium complex (MAC) prophylaxis in HIV patients.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Azithromycin",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult oral dose: 500 mg on day 1, followed by 250 mg once daily on days 2–5 (commonly known as a 5-day 'Z-pack'). For some infections, a single 1 g dose may be prescribed. Pediatric dosing is weight-based.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Azithromycin",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include nausea, diarrhea, abdominal pain, and headache. Rare but serious effects include QT prolongation, hepatotoxicity, allergic reactions, and Clostridium difficile–associated diarrhea.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Azithromycin",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with known hypersensitivity to macrolide antibiotics (azithromycin, erythromycin, clarithromycin). Not recommended in patients with a history of cholestatic jaundice or hepatic dysfunction associated with prior azithromycin use.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Azithromycin",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Use with caution in patients with existing heart rhythm disorders due to risk of QT prolongation. Should be avoided in severe liver disease. Overuse may lead to bacterial resistance.",
            "source": "Medical_Reference"
        },

        #Doxycycline
        {
            "drug_name": "Doxycycline",
            "section": ["indications", "usage", "uses"],
            "text": "Doxycycline is a tetracycline antibiotic used to treat bacterial infections including respiratory tract infections, acne, skin infections, urinary tract infections, sexually transmitted infections (like chlamydia and gonorrhea), and tick-borne diseases such as Lyme disease and Rocky Mountain spotted fever. It is also used for malaria prophylaxis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Doxycycline",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult dose: 100 mg orally every 12 hours on the first day, followed by 100 mg once daily or every 12 hours depending on infection type. For malaria prophylaxis: 100 mg daily starting 1–2 days before travel, during travel, and for 4 weeks after leaving the endemic area.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Doxycycline",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects: nausea, vomiting, diarrhea, photosensitivity (sun sensitivity), and abdominal discomfort. Rare but serious side effects include esophageal irritation/ulceration, hepatotoxicity, intracranial hypertension, and hypersensitivity reactions.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Doxycycline",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with hypersensitivity to tetracyclines. Not recommended for use in children under 8 years due to risk of permanent teeth discoloration and impaired bone growth. Contraindicated during the second and third trimesters of pregnancy.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Doxycycline",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Take with plenty of water and remain upright for at least 30 minutes to reduce risk of esophageal irritation. Avoid prolonged sun exposure due to risk of photosensitivity. May interact with antacids, iron, and dairy products, which can reduce absorption.",
            "source": "Medical_Reference"
        },

        #Levothyroxine
        {
            "drug_name": "Levothyroxine",
            "section": ["indications", "usage", "uses"],
            "text": "Levothyroxine is a synthetic thyroid hormone used to treat hypothyroidism (underactive thyroid). It helps restore normal metabolism, energy levels, and growth. It is also used to prevent recurrence of goiter and as part of thyroid cancer management.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Levothyroxine",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult starting dose: 25–50 mcg orally once daily, adjusted every 4–6 weeks based on thyroid function tests. Maintenance dose usually ranges from 75–150 mcg daily. Should be taken on an empty stomach, 30–60 minutes before breakfast, with water.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Levothyroxine",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Side effects are usually related to overdose and mimic hyperthyroidism, including palpitations, tachycardia, weight loss, heat intolerance, tremors, anxiety, and insomnia. Long-term excessive use may cause osteoporosis or atrial fibrillation.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Levothyroxine",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in untreated thyrotoxicosis, acute myocardial infarction, or uncorrected adrenal insufficiency. Use cautiously in elderly patients and those with cardiovascular disease.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Levothyroxine",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Levothyroxine is not for weight loss and can be dangerous if misused. Consistency in brand or formulation is important due to variations in absorption. Certain medications and supplements (iron, calcium, antacids, soy) can interfere with absorption and should be taken several hours apart.",
            "source": "Medical_Reference"
        },

        #Prednisone
        {
            "drug_name": "Prednisone",
            "section": ["indications", "usage", "uses"],
            "text": "Prednisone is a corticosteroid used to reduce inflammation and suppress the immune system. It is commonly prescribed for asthma, COPD, rheumatoid arthritis, lupus, inflammatory bowel disease, severe allergies, skin disorders, and certain cancers.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Prednisone",
            "section": ["dosage", "directions", "how to use"],
            "text": "Typical adult dose ranges from 5–60 mg orally once daily depending on the condition. For acute conditions, higher doses may be given and tapered gradually to prevent adrenal insufficiency. Should be taken with food to reduce stomach irritation.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Prednisone",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include weight gain, fluid retention, increased appetite, mood swings, insomnia, and elevated blood sugar. Long-term use may lead to osteoporosis, cataracts, muscle weakness, suppressed immunity, and Cushing’s syndrome.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Prednisone",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with systemic fungal infections or known hypersensitivity. Use with caution in people with diabetes, hypertension, peptic ulcer disease, infections, or osteoporosis.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Prednisone",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Abrupt discontinuation after long-term use may cause adrenal crisis; doses must be tapered gradually. Prednisone suppresses immune function, increasing infection risk. Live vaccines should be avoided during therapy. Monitor blood pressure, blood glucose, and bone density with prolonged use.",
            "source": "Medical_Reference"
        },

        #Albuterol
        {
            "drug_name": "Albuterol",
            "section": ["indications", "usage", "uses"],
            "text": "Albuterol is a short-acting beta-2 adrenergic agonist (SABA) used as a bronchodilator. It is primarily prescribed for quick relief of asthma symptoms, prevention of exercise-induced bronchospasm, and management of reversible obstructive airway disease such as COPD.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Albuterol",
            "section": ["dosage", "directions", "how to use"],
            "text": "Inhalation: 2 inhalations (90 mcg each) every 4–6 hours as needed. Nebulizer: 2.5 mg every 6–8 hours. Maximum recommended daily inhalation dose is 12 puffs. Overuse can lead to reduced effectiveness and adverse effects.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Albuterol",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include tremors, nervousness, headache, dizziness, rapid heartbeat, and throat irritation. Less common but serious effects include chest pain, severe hypertension, arrhythmias, and paradoxical bronchospasm.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Albuterol",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with hypersensitivity to albuterol or related sympathomimetic amines. Caution is advised in patients with cardiovascular disorders, hypertension, seizure disorders, hyperthyroidism, or diabetes.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Albuterol",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Excessive use may lead to serious cardiovascular effects or loss of asthma control. Should not be used as a substitute for long-term asthma control medications (like inhaled corticosteroids). Monitor heart rate and blood pressure in sensitive patients.",
            "source": "Medical_Reference"
        },

        #Montelukast
        {
            "drug_name": "Montelukast",
            "section": ["indications", "usage", "uses"],
            "text": "Montelukast is a leukotriene receptor antagonist (LTRA) used in the prevention and long-term treatment of asthma, relief of seasonal and perennial allergic rhinitis, and prevention of exercise-induced bronchospasm. It is not effective for acute asthma attacks.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Montelukast",
            "section": ["dosage", "directions", "how to use"],
            "text": "Adults (15+ years): 10 mg once daily in the evening. Children (6–14 years): 5 mg chewable tablet once daily. Children (2–5 years): 4 mg chewable tablet or granules once daily. Should be taken regularly, even when symptoms are not present.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Montelukast",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include headache, abdominal pain, cough, and fatigue. Rare but serious side effects may include mood changes, agitation, depression, hallucinations, or suicidal thoughts.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Montelukast",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Contraindicated in patients with hypersensitivity to montelukast or any of its components. Caution is required in patients with a history of neuropsychiatric disorders.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Montelukast",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Montelukast should not be used to treat acute asthma attacks. Patients should be monitored for neuropsychiatric events. Use with caution in patients with phenylketonuria (certain formulations may contain aspartame).",
            "source": "Medical_Reference"
        },

        #Methotrexate
        {
            "drug_name": "Methotrexate",
            "section": ["indications", "usage", "uses"],
            "text": "Methotrexate is indicated for the treatment of rheumatoid arthritis, psoriasis, and certain cancers such as leukemia, lymphoma, and breast cancer. In arthritis and autoimmune diseases, it works by suppressing the immune system to reduce inflammation and slow disease progression.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Methotrexate",
            "section": ["dosage", "directions", "how to use"],
            "text": "For rheumatoid arthritis: The typical starting dose is 7.5–15 mg once weekly, which may be increased gradually to a maximum of 25 mg per week. In psoriasis: 10–25 mg once weekly. In oncology, dosing varies depending on cancer type and may be much higher, given with folinic acid (leucovorin) rescue to reduce toxicity. Always taken once weekly, never daily, to avoid severe toxicity.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Methotrexate",
            "section": ["adverse reactions", "side effects", "potential risks"],
            "text": "Common side effects include nausea, fatigue, mouth sores, and dizziness. Serious risks include liver toxicity, bone marrow suppression, lung disease, and increased risk of infections. Long-term use requires regular blood tests to monitor safety.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Methotrexate",
            "section": ["contraindications", "who should not take", "not recommended for"],
            "text": "Methotrexate should not be used in patients with pregnancy, liver disease, severe kidney impairment, bone marrow suppression, or alcohol abuse. It is contraindicated during breastfeeding. Caution in elderly patients and those with infection risk.",
            "source": "Medical_Reference"
        },
        {
            "drug_name": "Methotrexate",
            "section": ["warnings", "precautions", "safety warnings", "important safety information"],
            "text": "Methotrexate can cause severe and sometimes fatal toxicities, including hepatotoxicity, pulmonary toxicity, and bone marrow suppression. It must be taken only once weekly for autoimmune diseases. Concomitant alcohol use increases liver damage risk. Regular monitoring of liver function, kidney function, and blood counts is essential.",
            "source": "Medical_Reference"
        },
        
        # Add more drug data as needed
    ]
    
    # Save to JSONL file
    with open(output_file, 'w', encoding='utf-8') as f:
        for doc in complete_medical_data:
            f.write(json.dumps(doc, ensure_ascii=False) + '\n')
    
    print(f"✅ Created complete medical dataset with {len(complete_medical_data)} documents")
    print(f"📄 Saved to: {output_file}")
    
    # Show summary
    drugs = set(doc['drug_name'] for doc in complete_medical_data)
    sections = set()
    for doc in complete_medical_data:
        if isinstance(doc['section'], list):
            sections.update(doc['section'])
        else:
            sections.add(doc['section'])
    
    print(f"\n📊 Dataset Summary:")
    print(f"🏥 Drugs covered: {', '.join(sorted(drugs))}")
    print(f"📋 Sections included: {', '.join(sorted(sections))}")
    
    return complete_medical_data

if __name__ == "__main__":
    create_complete_medical_dataset()