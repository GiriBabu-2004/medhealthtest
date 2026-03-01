from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uvicorn
import traceback
import time
import re
import asyncio
from contextlib import asynccontextmanager

# Import your existing modules
from medical_qa_interface import MedicalQASystem
from deepseek_refiner import DeepSeekRefiner

# Global variables to store initialized systems
qa_system = None
refiner_system = None

# Drug extraction functions - can be used anywhere in the API
def extract_drug_from_text(text):
    """
    Extract drug name from any text (standalone function)
    
    Args:
        text (str): Any text that may contain drug names
        
    Returns:
        str or None: First drug name found, or None if no drug detected
    """
    if not text or not isinstance(text, str):
        return None
        
    text_lower = text.lower().strip()
    
    # Remove common question words and punctuation to focus on drug name
    clean_text = re.sub(r'\b(what|how|tell|me|about|of|for|is|are|the|a|an|common|recommended|important|any)\b', '', text_lower)
    clean_text = re.sub(r'[?.,!]', '', clean_text).strip()
    
    # Known drug list - expand this based on your dataset
    known_drugs = [
        'ibuprofen', 'acetaminophen', 'paracetamol', 'aspirin', 'metformin', 
        'losartan', 'warfarin', 'amitriptyline', 'lithium', 'methotrexate', 
        'atenolol', 'morphine', 'tramadol', 'celecoxib', 'prednisone', 
        'naproxen', 'ciprofloxacin', 'levothyroxine', 'amlodipine',
        'omeprazole', 'simvastatin', 'lisinopril', 'hydrochlorothiazide',
        'gabapentin', 'sertraline', 'fluoxetine', 'lorazepam', 'diazepam',
        'metoprolol', 'carvedilol', 'furosemide', 'spironolactone'
    ]
    
    # First, check for known drugs (exact match)
    for drug in known_drugs:
        if drug in text_lower:
            return drug
    
    # Then check for drug-like patterns at the beginning of text
    words = clean_text.split()
    if words:
        first_word = words[0].strip()
        # Check if first word looks like a drug name (length > 4, contains typical drug endings)
        if len(first_word) > 4 and any(first_word.endswith(suffix) for suffix in ['in', 'ol', 'ide', 'ate', 'ine', 'cin', 'xin', 'pam', 'zol', 'tan', 'pin', 'lol', 'fen', 'one', 'mycin', 'pril', 'sartan', 'statin']):
            return first_word
        
        # If first word is long enough, it might be a drug name
        if len(first_word) > 6:
            return first_word
    
    # Pattern-based extraction as fallback
    drug_patterns = [
        r'(\b\w+(?:in|ol|ide|ate|ine|cin|xin|pam|zol|tan|pin|lol|fen|one|mycin|pril|sartan|statin)\b)',
        r'(\b\w{6,}\b)',  # Any word 6+ characters
    ]
    
    for pattern in drug_patterns:
        matches = re.findall(pattern, clean_text, re.IGNORECASE)
        if matches:
            drug_name = matches[0].strip()
            if len(drug_name) > 4:  # Avoid very short matches
                return drug_name
    
    return None


def extract_all_drugs_from_text(text):
    """
    Extract all drug names from any text (standalone function)
    
    Args:
        text (str): Any text that may contain multiple drug names
        
    Returns:
        list: List of all drug names found (can be empty)
    """
    if not text or not isinstance(text, str):
        return []
        
    text_lower = text.lower()
    all_drugs = []
    
    # Known drug list
    known_drugs = [
        'ibuprofen', 'acetaminophen', 'paracetamol', 'aspirin', 'metformin', 
        'losartan', 'warfarin', 'amitriptyline', 'lithium', 'methotrexate', 
        'atenolol', 'morphine', 'tramadol', 'celecoxib', 'prednisone', 
        'naproxen', 'ciprofloxacin', 'levothyroxine', 'amlodipine',
        'omeprazole', 'simvastatin', 'lisinopril', 'hydrochlorothiazide',
        'gabapentin', 'sertraline', 'fluoxetine', 'lorazepam', 'diazepam',
        'metoprolol', 'carvedilol', 'furosemide', 'spironolactone'
    ]
    
    # Check for known drugs
    for drug in known_drugs:
        if drug in text_lower and drug not in [d.lower() for d in all_drugs]:
            all_drugs.append(drug)
    
    # Pattern-based extraction for additional drugs
    drug_patterns = [
        r'\b(\w+(?:in|ol|ide|ate|ine|cin|xin|pam|zol|tan|pin|lol|fen|one|mycin|pril|sartan|statin))\b'
    ]
    
    for pattern in drug_patterns:
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        for match in matches:
            if len(match.strip()) > 4:  # Avoid very short matches
                drug_name = match.strip()
                if drug_name not in [d.lower() for d in all_drugs]:
                    all_drugs.append(drug_name)
    
    return all_drugs

# Pydantic models for request/response
class MedicalQuery(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="Medical question to ask")
    use_refinement: bool = Field(default=True, description="Whether to use AI refinement")
    confidence_threshold: float = Field(default=0.0, ge=0.0, le=1.0, description="Minimum confidence threshold")

class DrugExtractionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to extract drug names from")

class DrugExtractionResponse(BaseModel):
    text: str
    single_drug: Optional[str]
    all_drugs: List[str]
    drug_count: int

class SourceInfo(BaseModel):
    drug: str
    section: str
    score: float
    url: Optional[str] = None

class MedicalResponse(BaseModel):
    query: str
    raw_answer: str
    refined_answer: Optional[str] = None
    final_answer: str
    confidence: str
    query_type: List[str]
    sources: List[SourceInfo]
    processing_time: float
    refinement_used: str  # "ai", "simple", or "none"

class HealthCheck(BaseModel):
    status: str
    qa_system_loaded: bool
    refiner_loaded: bool
    timestamp: str

class ErrorResponse(BaseModel):
    error: str
    detail: str
    timestamp: str

# Utility functions from your original code
def simple_text_refiner(query: str, raw_answer: str) -> str:
    """Simple rule-based text refinement as fallback"""
    try:
        # Remove excessive repetition
        lines = raw_answer.split('\n')
        unique_lines = []
        seen_content = set()
        
        for line in lines:
            # Clean up the line
            clean_line = re.sub(r'\*+', '', line).strip()
            
            # Skip if we've seen similar content
            if clean_line and clean_line not in seen_content:
                unique_lines.append(line)
                seen_content.add(clean_line)
        
        refined = '\n'.join(unique_lines)
        
        # Basic formatting improvements
        refined = re.sub(r'\n{3,}', '\n\n', refined)  # Remove excessive newlines
        refined = re.sub(r'\*{3,}', '**', refined)    # Fix excessive asterisks
        
        return refined.strip()
        
    except Exception as e:
        print(f"⚠️ Simple refinement failed: {e}")
        return raw_answer

def is_garbled_output(text: str) -> bool:
    """Check if the output is garbled or repetitive"""
    if not text or len(text) < 20:
        return True
    
    # Check for excessive repetition
    lines = text.split('\n')
    if len(lines) > 10:
        # Count repeated lines
        line_counts = {}
        for line in lines:
            clean_line = re.sub(r'[*\d\.]', '', line).strip()
            if clean_line:
                line_counts[clean_line] = line_counts.get(clean_line, 0) + 1
        
        # If any line appears more than 3 times, it's likely garbled
        if any(count > 3 for count in line_counts.values()):
            return True
    
    # Check for incomplete sentences at the end
    if text.rstrip().endswith(('**', '*', '‹', '›')):
        return True
    
    return False

async def initialize_systems():
    """Initialize the QA and refiner systems"""
    global qa_system, refiner_system
    
    try:
        print("🚀 Initializing Medical QA System...")
        qa_system = MedicalQASystem()
        print("✅ Medical QA System loaded successfully")
        
        # Try to initialize refiner
        print("🔄 Initializing Answer Refiner...")
        try:
            refiner_system = DeepSeekRefiner(llm_name="distilgpt2")
            print("✅ Answer refiner loaded successfully")
        except Exception as e:
            print(f"⚠️ Could not load refiner: {str(e)[:100]}...")
            print("📝 Will use simple text refinement instead")
            refiner_system = None
            
    except Exception as e:
        print(f"❌ Failed to initialize systems: {e}")
        raise

async def cleanup_systems():
    """Cleanup system resources"""
    global qa_system, refiner_system
    
    try:
        if refiner_system and hasattr(refiner_system, 'cleanup'):
            print("🧹 Cleaning up refiner resources...")
            refiner_system.cleanup()
        
        if qa_system and hasattr(qa_system, 'cleanup'):
            print("🧹 Cleaning up QA system resources...")
            qa_system.cleanup()
            
        print("✅ Resource cleanup completed")
        
    except Exception as e:
        print(f"⚠️ Error during cleanup: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - startup and shutdown"""
    # Startup
    await initialize_systems()
    yield
    # Shutdown
    await cleanup_systems()

# Create FastAPI app with lifespan management
app = FastAPI(
    title="Medical QA API",
    description="Enhanced Medical Question Answering System with AI refinement and drug extraction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Medical QA API with Drug Extraction",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return HealthCheck(
        status="healthy" if qa_system else "unhealthy",
        qa_system_loaded=qa_system is not None,
        refiner_loaded=refiner_system is not None,
        timestamp=time.strftime('%Y-%m-%d %H:%M:%S')
    )

@app.post("/extract-drug", response_model=DrugExtractionResponse)
async def extract_drug_names(request: DrugExtractionRequest):
    """Extract drug names from any text"""
    try:
        # Extract single drug (first found)
        single_drug = extract_drug_from_text(request.text)
        
        # Extract all drugs
        all_drugs = extract_all_drugs_from_text(request.text)
        
        return DrugExtractionResponse(
            text=request.text,
            single_drug=single_drug,
            all_drugs=all_drugs,
            drug_count=len(all_drugs)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error extracting drug names: {str(e)}"
        )

@app.post("/ask", response_model=MedicalResponse)
async def ask_medical_question(query: MedicalQuery):
    """Main endpoint for asking medical questions"""
    if not qa_system:
        raise HTTPException(
            status_code=503, 
            detail="Medical QA system not initialized"
        )
    
    start_time = time.time()
    
    try:
        # Get answer from QA system
        qa_response = qa_system.generate_answer(query.question)
        
        if isinstance(qa_response, dict):
            raw_answer = qa_response['answer']
            sources = qa_response.get('sources', [])
            confidence = qa_response.get('confidence', 'unknown')
            query_type = qa_response.get('query_type', ['general'])
            
            # Check confidence threshold
            confidence_score = 0.5  # Default if not numeric
            if isinstance(confidence, (int, float)):
                confidence_score = float(confidence)
            elif confidence.lower() in ['high', 'medium', 'low']:
                confidence_map = {'high': 0.8, 'medium': 0.5, 'low': 0.2}
                confidence_score = confidence_map.get(confidence.lower(), 0.5)
            
            if confidence_score < query.confidence_threshold:
                raise HTTPException(
                    status_code=422,
                    detail=f"Answer confidence ({confidence}) below threshold ({query.confidence_threshold})"
                )
            
            # Process refinement
            refined_answer = None
            final_answer = raw_answer
            refinement_used = "none"
            
            if query.use_refinement and raw_answer.strip():
                if refiner_system:
                    try:
                        refined = refiner_system.refine(query.question, raw_answer)
                        
                        if refined and not is_garbled_output(refined):
                            refined_answer = refined
                            final_answer = refined
                            refinement_used = "ai"
                        else:
                            refined_answer = simple_text_refiner(query.question, raw_answer)
                            final_answer = refined_answer
                            refinement_used = "simple"
                            
                    except Exception as e:
                        print(f"❌ AI Refinement failed: {e}")
                        refined_answer = simple_text_refiner(query.question, raw_answer)
                        final_answer = refined_answer
                        refinement_used = "simple"
                else:
                    refined_answer = simple_text_refiner(query.question, raw_answer)
                    final_answer = refined_answer
                    refinement_used = "simple"
            
            # Convert sources to response format
            source_list = [
                SourceInfo(
                    drug=source['drug'],
                    section=source['section'],
                    score=source['score'],
                    url=source.get('url')
                )
                for source in sources
            ]
            
            processing_time = time.time() - start_time
            
            return MedicalResponse(
                query=query.question,
                raw_answer=raw_answer,
                refined_answer=refined_answer,
                final_answer=final_answer,
                confidence=str(confidence),
                query_type=query_type,
                sources=source_list,
                processing_time=round(processing_time, 3),
                refinement_used=refinement_used
            )
            
        else:
            # Simple string response
            processing_time = time.time() - start_time
            final_answer = simple_text_refiner(query.question, str(qa_response))
            
            return MedicalResponse(
                query=query.question,
                raw_answer=str(qa_response),
                refined_answer=None,
                final_answer=final_answer,
                confidence="unknown",
                query_type=["general"],
                sources=[],
                processing_time=round(processing_time, 3),
                refinement_used="simple"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        processing_time = time.time() - start_time
        error_detail = str(e)
        print(f"❌ Error processing query: {error_detail}")
        traceback.print_exc()
        
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {error_detail}"
        )

@app.post("/ask-simple", response_model=Dict[str, Any])
async def ask_simple(query: MedicalQuery):
    """Simplified endpoint that returns just the answer and basic info"""
    if not qa_system:
        raise HTTPException(
            status_code=503, 
            detail="Medical QA system not initialized"
        )
    
    try:
        qa_response = qa_system.generate_answer(query.question)
        
        if isinstance(qa_response, dict):
            raw_answer = qa_response['answer']
            
            # Apply simple refinement
            final_answer = simple_text_refiner(query.question, raw_answer)
            
            return {
                "question": query.question,
                "answer": final_answer,
                "confidence": qa_response.get('confidence', 'unknown'),
                "source_count": len(qa_response.get('sources', []))
            }
        else:
            final_answer = simple_text_refiner(query.question, str(qa_response))
            return {
                "question": query.question,
                "answer": final_answer,
                "confidence": "unknown",
                "source_count": 0
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )

@app.get("/examples", response_model=Dict[str, List[str]])
async def get_example_queries():
    """Get example queries for the medical system"""
    examples = [
        "What is Losartan used for?",
        "What are the side effects of Ibuprofen?", 
        "What is the dosage of Metformin?",
        "Who should not take Warfarin?",
        "How does Amitriptyline work?",
        "What are the warnings for Lithium?",
        "What is Losartan used for? What are its side effects? What is the dosage?",
    ]
    
    return {"examples": examples}

@app.post("/batch-ask", response_model=List[MedicalResponse])
async def ask_multiple_questions(queries: List[MedicalQuery]):
    """Process multiple questions in batch"""
    if not qa_system:
        raise HTTPException(
            status_code=503, 
            detail="Medical QA system not initialized"
        )
    
    if len(queries) > 10:  # Limit batch size
        raise HTTPException(
            status_code=422,
            detail="Maximum 10 questions per batch request"
        )
    
    responses = []
    
    for query in queries:
        try:
            # Process each query (reuse logic from main ask endpoint)
            start_time = time.time()
            qa_response = qa_system.generate_answer(query.question)
            
            if isinstance(qa_response, dict):
                raw_answer = qa_response['answer']
                sources = qa_response.get('sources', [])
                confidence = qa_response.get('confidence', 'unknown')
                query_type = qa_response.get('query_type', ['general'])
                
                # Process refinement
                refined_answer = None
                final_answer = raw_answer
                refinement_used = "none"
                
                if query.use_refinement and raw_answer.strip():
                    if refiner_system:
                        try:
                            refined = refiner_system.refine(query.question, raw_answer)
                            
                            if refined and not is_garbled_output(refined):
                                refined_answer = refined
                                final_answer = refined
                                refinement_used = "ai"
                            else:
                                refined_answer = simple_text_refiner(query.question, raw_answer)
                                final_answer = refined_answer
                                refinement_used = "simple"
                                
                        except Exception:
                            refined_answer = simple_text_refiner(query.question, raw_answer)
                            final_answer = refined_answer
                            refinement_used = "simple"
                    else:
                        refined_answer = simple_text_refiner(query.question, raw_answer)
                        final_answer = refined_answer
                        refinement_used = "simple"
                
                # Convert sources
                source_list = [
                    SourceInfo(
                        drug=source['drug'],
                        section=source['section'],
                        score=source['score'],
                        url=source.get('url')
                    )
                    for source in sources
                ]
                
                processing_time = time.time() - start_time
                
                responses.append(MedicalResponse(
                    query=query.question,
                    raw_answer=raw_answer,
                    refined_answer=refined_answer,
                    final_answer=final_answer,
                    confidence=str(confidence),
                    query_type=query_type,
                    sources=source_list,
                    processing_time=round(processing_time, 3),
                    refinement_used=refinement_used
                ))
                
        except Exception as e:
            # For batch processing, we'll return partial results
            # instead of failing the entire batch
            responses.append(MedicalResponse(
                query=query.question,
                raw_answer=f"Error: {str(e)}",
                refined_answer=None,
                final_answer=f"Error processing question: {str(e)}",
                confidence="error",
                query_type=["error"],
                sources=[],
                processing_time=0.0,
                refinement_used="none"
            ))
    
    return responses

@app.get("/system-info", response_model=Dict[str, Any])
async def get_system_info():
    """Get information about the loaded systems"""
    return {
        "qa_system": {
            "loaded": qa_system is not None,
            "type": type(qa_system).__name__ if qa_system else None
        },
        "refiner_system": {
            "loaded": refiner_system is not None,
            "type": type(refiner_system).__name__ if refiner_system else None
        },
        "server_time": time.strftime('%Y-%m-%d %H:%M:%S'),
        "api_version": "1.0.0",
        "features": ["medical_qa", "drug_extraction", "answer_refinement"]
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": "HTTP Error",
        "detail": exc.detail,
        "status_code": exc.status_code,
        "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return {
        "error": "Internal Server Error",
        "detail": str(exc),
        "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
    }

# Background task for saving results (optional)
def save_result_background(query: str, response: MedicalResponse):
    """Background task to save results to file"""
    try:
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"api_medical_qa_results_{timestamp}.txt"
        
        with open(filename, "w", encoding="utf-8") as f:
            f.write(f"Medical QA API Results\n")
            f.write(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"{'='*60}\n\n")
            f.write(f"Query: {response.query}\n")
            f.write(f"Confidence Level: {response.confidence}\n")
            f.write(f"Query Type: {', '.join(response.query_type)}\n")
            f.write(f"Processing Time: {response.processing_time}s\n")
            f.write(f"Refinement Used: {response.refinement_used}\n\n")
            f.write(f"Raw Answer:\n{'-'*40}\n{response.raw_answer}\n\n")
            f.write(f"Final Answer:\n{'-'*40}\n{response.final_answer}\n\n")
            
            if response.sources:
                f.write(f"Sources ({len(response.sources)} found):\n{'-'*40}\n")
                for i, source in enumerate(response.sources, 1):
                    f.write(f"{i}. Drug: {source.drug}\n")
                    f.write(f"   Section: {source.section}\n")
                    f.write(f"   Relevance Score: {source.score:.3f}\n")
                    if source.url:
                        f.write(f"   URL: {source.url}\n")
                    f.write(f"\n")
            
    except Exception as e:
        print(f"⚠️ Could not save API results to file: {e}")

@app.post("/ask-and-save", response_model=MedicalResponse)
async def ask_and_save(query: MedicalQuery, background_tasks: BackgroundTasks):
    """Ask a question and save results in background"""
    response = await ask_medical_question(query)
    background_tasks.add_task(save_result_background, query.question, response)
    return response

if __name__ == "__main__":
    # Configuration for different environments
    import argparse
    
    parser = argparse.ArgumentParser(description="Medical QA API Server")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload for development")
    parser.add_argument("--workers", type=int, default=1, help="Number of worker processes")
    
    args = parser.parse_args()
    
    # Run the server
    uvicorn.run(
        "main:app",  # Assuming this file is named main.py
        host=args.host,
        port=args.port,
        reload=args.reload,
        workers=args.workers
    )