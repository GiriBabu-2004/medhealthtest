from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging
import re
from typing import List, Dict, Any, Optional

from ocr_utils import extract_text_from_pdf, extract_text_from_image
from ai_utils import MedicalQAConnector

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OCR Medical Analysis API",
    description="Extract text from medical prescriptions/labels and analyze with Medical QA",
    version="1.0.0"
)

# Initialize Medical QA connector
medical_qa = MedicalQAConnector()

# ✅ CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for text analysis request
class TextAnalysisRequest(BaseModel):
    text: str

def extract_medicine_names(text: str) -> List[str]:
    """
    Extract medicine names from prescription/label text using Medical QA system's drug extraction endpoint
    """
    medicine_names = []
    
    try:
        # Use the Medical QA system's drug extraction endpoint
        if medical_qa and medical_qa.test_connection():
            logger.info("Using Medical QA system drug extraction endpoint")
            
            try:
                # Use the extract_drugs method from MedicalQAConnector
                result = medical_qa.extract_drugs(text)
                
                if result.get("success"):
                    # Get the extracted drugs from the API response
                    all_drugs = result.get("all_drugs", [])
                    drug_count = result.get("drug_count", 0)
                    
                    logger.info(f"Medical QA drug extraction found {drug_count} drugs: {all_drugs}")
                    
                    # Process the extracted drugs
                    for drug in all_drugs:
                        # Clean up the drug name
                        drug_name = drug.strip()
                        
                        # Basic validation
                        if (len(drug_name) >= 2 and 
                            len(drug_name) <= 50 and
                            drug_name not in medicine_names):
                            medicine_names.append(drug_name)
                    
                    if medicine_names:
                        logger.info(f"Successfully extracted medicines using drug extraction endpoint: {medicine_names}")
                        return medicine_names[:5]  # Limit to 5 medicines max
                else:
                    logger.warning(f"Drug extraction endpoint failed: {result.get('error', 'Unknown error')}")
                    
            except Exception as e:
                logger.warning(f"Medical QA drug extraction failed: {e}")
        
        # If Medical QA drug extraction didn't work, fall back to pattern matching
        if not medicine_names:
            logger.info("Falling back to pattern-based medicine extraction")
            
            # Original pattern-based extraction (simplified version of your existing code)
            patterns = [
                # Medicine names before dosage information
                r'^([A-Za-z][A-Za-z\s\-]{2,30}?)\s+(?:\d+\s*(?:mg|g|ml|mcg|units?))',
                # Medicine names in caps
                r'^([A-Z][A-Z\s\-]{3,25})\s',
                # Medicine names followed by strength
                r'([A-Za-z][A-Za-z\s\-]{2,25})\s+\d+\s*(?:mg|g|ml|mcg|units?)',
                # Generic/Brand name patterns
                r'(?:Generic|Active ingredient|Drug name|Brand|Trade name):\s*([A-Za-z][A-Za-z\s\-]+?)(?:\s*\d|$|\n)',
                # Medicine names in prescription format
                r'(?:Rx|Take|Medicine):\s*([A-Za-z][A-Za-z\s\-]+?)(?:\s|$)',
                # CAPS + strength
                r'([A-Z][A-Z\s\-]{3,30})(?:\s+\d+\s*(?:mg|g|ml|mcg|units?))',
                # Word + strength
                r'([A-Za-z][A-Za-z\s\-]{2,30})(?:\s+\d+\s*(?:mg|g|ml|mcg|units?))',
            ]
            
            # Split text into lines for better parsing
            lines = text.split('\n')
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                # Try each pattern
                for pattern in patterns:
                    matches = re.finditer(pattern, line, re.IGNORECASE | re.MULTILINE)
                    for match in matches:
                        medicine_name = match.group(1).strip()
                        
                        # Clean up the medicine name
                        medicine_name = re.sub(r'\s+', ' ', medicine_name)  # Remove extra spaces
                        medicine_name = medicine_name.title()  # Proper case
                        
                        # Validate medicine name (basic checks)
                        if (len(medicine_name) >= 3 and 
                            len(medicine_name) <= 50 and 
                            not re.match(r'^\d+$', medicine_name) and  # Not just numbers
                            medicine_name not in ['Take', 'Tablet', 'Capsule', 'Mg', 'Ml', 'Dose']):
                            
                            if medicine_name not in medicine_names:
                                medicine_names.append(medicine_name)
            
            # If still no medicines found, try more aggressive pattern matching
            if not medicine_names:
                additional_patterns = [
                    # Look for capitalized words followed by numbers
                    r'\b([A-Z][a-z]{2,20})\s+\d+',
                    # Look for medicine-like words
                    r'\b([A-Z][a-z]+(?:in|ol|ex|ide|ate|ine|ium|one|ase|pam|zole|afil|pril|etan|oxin|mycin|cillin|sulfa)[a-z]*)\b',
                    # Generic fallback for proper nouns
                    r'\b([A-Z][a-z]{3,20})\b'
                ]
                
                for pattern in additional_patterns:
                    matches = re.finditer(pattern, text)
                    for match in matches:
                        potential_medicine = match.group(1).strip()
                        
                        # Filter out common non-medicine words
                        exclude_words = {
                            'Patient', 'Doctor', 'Hospital', 'Pharmacy', 'Date', 'Time', 
                            'Prescription', 'Tablet', 'Capsule', 'Morning', 'Evening',
                            'Daily', 'Weekly', 'Monthly', 'Before', 'After', 'With', 'Without'
                        }
                        
                        if (potential_medicine not in exclude_words and 
                            len(potential_medicine) >= 4 and 
                            potential_medicine not in medicine_names):
                            medicine_names.append(potential_medicine)
                            
                    # Stop if we found some medicines
                    if medicine_names:
                        break
        
        # Final validation: if we have medicines, verify them with Medical QA system
        if medicine_names and medical_qa and medical_qa.test_connection():
            validated_medicines = []
            for medicine in medicine_names[:3]:  # Limit to 3 for validation to avoid too many API calls
                try:
                    # Ask a simple question about the medicine to validate it exists
                    validation_query = f"Is {medicine} a real medicine or drug?"
                    validation_result = medical_qa.ask_simple(validation_query, max_retries=1)
                    
                    if validation_result.get("success") and validation_result.get("answer"):
                        answer = validation_result.get("answer", "").lower()
                        # If the answer suggests it's a real medicine, keep it
                        if any(word in answer for word in ['yes', 'is a', 'used for', 'medication', 'drug', 'medicine', 'treat']):
                            validated_medicines.append(medicine)
                            logger.info(f"Validated medicine: {medicine}")
                        else:
                            logger.info(f"Rejected medicine: {medicine}")
                            
                except Exception as e:
                    logger.warning(f"Validation failed for {medicine}: {e}")
                    # If validation fails, keep the medicine (don't remove it)
                    validated_medicines.append(medicine)
            
            if validated_medicines:
                medicine_names = validated_medicines
    
    except Exception as e:
        logger.error(f"Medicine extraction failed: {e}")
        # Return empty list on error
        return []
    
    # Remove duplicates and return
    unique_medicines = []
    seen = set()
    for med in medicine_names:
        med_lower = med.lower()
        if med_lower not in seen:
            unique_medicines.append(med)
            seen.add(med_lower)
    
    logger.info(f"Final extracted medicines: {unique_medicines}")
    return unique_medicines[:5]  # Limit to 5 medicines max

def generate_medicine_questions(medicine_names: List[str]) -> List[str]:
    """
    Generate standard medical questions for each medicine
    """
    if not medicine_names:
        return []
    
    # Standard questions to ask about each medicine
    question_templates = [
        "What is {medicine} used for?",
        "What are the side effects of {medicine}?", 
        "What is the correct dosage of {medicine}?",
        "What are the warnings and precautions for {medicine}?",
        "How does {medicine} work?"
    ]
    
    questions = []
    for medicine in medicine_names:
        for template in question_templates:
            questions.append(template.format(medicine=medicine))
    
    return questions

async def get_medical_qa_analysis(medicine_names: List[str]) -> Dict[str, Any]:
    """
    Get medical analysis for extracted medicines using Medical QA API
    """
    if not medicine_names:
        return {"error": "No medicines found", "analyses": []}
    
    try:
        # Test if Medical QA API is available
        if not medical_qa.test_connection():
            logger.error("Medical QA API not available")
            return {"error": "Medical QA API unavailable", "analyses": []}
        
        analyses = []
        
        for medicine in medicine_names:
            medicine_analysis = {
                "medicine": medicine,
                "questions": [],
                "errors": []
            }
            
            # Generate questions for this medicine
            questions = [
                f"What is {medicine} used for?",
                f"What are the side effects of {medicine}?", 
                f"What is the correct dosage of {medicine}?",
                f"What are the warnings for {medicine}?"
            ]
            
            # Ask each question
            for question in questions:
                try:
                    result = medical_qa.ask_simple(question, max_retries=2)
                    
                    if result.get("success"):
                        medicine_analysis["questions"].append({
                            "question": question,
                            "answer": result.get("answer"),
                            "confidence": result.get("confidence"),
                            "source_count": result.get("source_count", 0)
                        })
                    else:
                        error_msg = result.get("error", "Unknown error")
                        logger.warning(f"Question failed: {question} - {error_msg}")
                        medicine_analysis["errors"].append(f"Question failed: {error_msg}")
                        
                except Exception as e:
                    logger.error(f"Error asking question '{question}': {e}")
                    medicine_analysis["errors"].append(f"Error with question: {str(e)}")
            
            analyses.append(medicine_analysis)
        
        return {
            "success": True,
            "analyses": analyses,
            "total_medicines": len(medicine_names)
        }
        
    except Exception as e:
        logger.error(f"Medical QA analysis failed: {e}")
        return {"error": f"Medical QA analysis failed: {str(e)}", "analyses": []}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Add detailed logging
        logger.info(f"Received file: {file.filename}")
        logger.info(f"Content type: {file.content_type}")
        logger.info(f"File size: {file.size if hasattr(file, 'size') else 'unknown'}")
        
        # Validate file exists and has content
        if not file.filename:
            logger.error("No filename provided")
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        filename = file.filename.lower()
        logger.info(f"Processing filename: {filename}")
        
        # Check file type before reading
        supported_extensions = (
            '.pdf', 
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', 
            '.webp', '.svg', '.ico', '.heic', '.heif', '.raw', '.cr2', 
            '.nef', '.arw', '.dng', '.orf', '.rw2', '.pef', '.srw'
        )
        if not filename.endswith(supported_extensions):
            logger.error(f"Unsupported file type: {filename}")
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Supported: {', '.join(supported_extensions)}"
            )
        
        # Read file content
        file_bytes = await file.read()
        logger.info(f"File read successfully, size: {len(file_bytes)} bytes")
        
        # Validate file content
        if not file_bytes:
            logger.error("File is empty")
            raise HTTPException(status_code=400, detail="File is empty")
        
        # OCR processing
        logger.info("Starting OCR processing...")
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_bytes)
        elif filename.endswith((
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', 
            '.webp', '.svg', '.ico', '.heic', '.heif', '.raw', '.cr2', 
            '.nef', '.arw', '.dng', '.orf', '.rw2', '.pef', '.srw'
        )):
            text = extract_text_from_image(file_bytes)
        
        logger.info(f"OCR completed, extracted text length: {len(text) if text else 0}")
        
        # Validate extracted text
        if not text or not text.strip():
            logger.warning("No text extracted from file")
            return JSONResponse({
                "error": "No text could be extracted from the file",
                "text": "",
                "extracted_medicines": [],
                "medical_analysis": {"error": "No text found", "analyses": []}
            }, status_code=400)
        
        # Extract medicine names from the text
        logger.info("Extracting medicine names...")
        medicine_names = extract_medicine_names(text)
        logger.info(f"Extracted medicines: {medicine_names}")
        
        # Get medical analysis from Medical QA API
        logger.info("Getting medical analysis from Medical QA API...")
        medical_analysis = await get_medical_qa_analysis(medicine_names)
        
        logger.info("Analysis completed")

        return {
            "filename": file.filename,
            "extracted_text": text.strip(),
            "extracted_medicines": medicine_names,
            "medical_analysis": medical_analysis,
            "processing_summary": {
                "text_length": len(text.strip()),
                "medicines_found": len(medicine_names),
                "medical_qa_available": medical_analysis.get("success", False),
                "questions_asked": sum(len(analysis.get("questions", [])) for analysis in medical_analysis.get("analyses", []))
            }
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/analyze-text/")
async def analyze_text(request: TextAnalysisRequest):
    """
    Endpoint to analyze text directly without file upload
    """
    try:
        text = request.text.strip()
        
        if not text:
            raise HTTPException(status_code=400, detail="Text is required and cannot be empty")
        
        logger.info(f"Analyzing text, length: {len(text)}")
        
        # Extract medicine names from the text
        logger.info("Extracting medicine names from text...")
        medicine_names = extract_medicine_names(text)
        logger.info(f"Extracted medicines: {medicine_names}")
        
        # Get medical analysis from Medical QA API
        logger.info("Getting medical analysis from Medical QA API...")
        medical_analysis = await get_medical_qa_analysis(medicine_names)
        
        logger.info("Text analysis completed")

        return {
            "extracted_text": text,
            "extracted_medicines": medicine_names,
            "medical_analysis": medical_analysis,
            "processing_summary": {
                "text_length": len(text),
                "medicines_found": len(medicine_names),
                "medical_qa_available": medical_analysis.get("success", False),
                "questions_asked": sum(len(analysis.get("questions", [])) for analysis in medical_analysis.get("analyses", []))
            }
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Text analysis error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/extract-medicines/")
async def extract_medicines_only(file: UploadFile = File(...)):
    """
    Endpoint to only extract medicine names from uploaded file
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        filename = file.filename.lower()
        
        # Check file type
        supported_extensions = ('.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp')
        if not filename.endswith(supported_extensions):
            raise HTTPException(status_code=400, detail=f"Unsupported file type")
        
        # Read and process file
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # OCR processing
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_bytes)
        else:
            text = extract_text_from_image(file_bytes)
        
        if not text or not text.strip():
            return JSONResponse({
                "error": "No text could be extracted from the file",
                "medicines": []
            }, status_code=400)
        
        # Extract medicine names
        medicine_names = extract_medicine_names(text)
        
        return {
            "filename": file.filename,
            "medicines": medicine_names,
            "count": len(medicine_names)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting medicines: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/analyze-medicine/")
async def analyze_specific_medicine(medicine_name: str):
    """
    Endpoint to analyze a specific medicine using Medical QA API
    """
    try:
        if not medicine_name or not medicine_name.strip():
            raise HTTPException(status_code=400, detail="Medicine name is required")
        
        medicine_name = medicine_name.strip()
        logger.info(f"Analyzing medicine: {medicine_name}")
        
        # Get analysis from Medical QA API
        analysis = await get_medical_qa_analysis([medicine_name])
        
        return {
            "medicine": medicine_name,
            "analysis": analysis
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing medicine: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Add a health check endpoint
@app.get("/health")
async def health_check():
    medical_qa_status = medical_qa.test_connection() if medical_qa else False
    
    return {
        "status": "healthy",
        "medical_qa_available": medical_qa_status,
        "services": {
            "ocr": "available",
            "medical_qa": "available" if medical_qa_status else "unavailable"
        }
    }

# Add an endpoint to check supported file types
@app.get("/supported-types")
async def supported_types():
    return {
        "supported_extensions": [
            ".pdf", 
            ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif", 
            ".webp", ".svg", ".ico", ".heic", ".heif", ".raw", ".cr2", 
            ".nef", ".arw", ".dng", ".orf", ".rw2", ".pef", ".srw"
        ],
        "max_file_size": "No explicit limit set",
        "features": [
            "OCR text extraction",
            "Medicine name extraction", 
            "Medical QA analysis"
        ]
    }

@app.get("/medical-qa-status")
async def medical_qa_status():
    """
    Check the status of Medical QA API connection
    """
    try:
        is_available = medical_qa.test_connection()
        system_info = medical_qa.get_system_info() if is_available else None
        
        return {
            "available": is_available,
            "system_info": system_info,
            "base_url": medical_qa.base_url if medical_qa else None
        }
    except Exception as e:
        return {
            "available": False,
            "error": str(e),
            "base_url": medical_qa.base_url if medical_qa else None
        }

# Cleanup on shutdown
@app.on_event("shutdown")
async def shutdown_event():
    if medical_qa:
        medical_qa.close()
        logger.info("Medical QA connector closed")