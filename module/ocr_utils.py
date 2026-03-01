from PyPDF2 import PdfReader
from pdf2image import convert_from_bytes
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import io
import logging
from typing import Optional, List
import os

# Set up logging
logger = logging.getLogger(__name__)

# OCR configuration
TESSERACT_CONFIG = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:-() '

def check_tesseract_installation() -> bool:
    """Check if Tesseract is properly installed"""
    try:
        pytesseract.get_tesseract_version()
        logger.info("Tesseract OCR is available")
        return True
    except Exception as e:
        logger.error(f"Tesseract not found: {e}")
        return False

def preprocess_image(image: Image.Image) -> Image.Image:
    """Enhance image quality for better OCR results"""
    try:
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)
        
        # Enhance sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2.0)
        
        # Apply slight blur to reduce noise
        image = image.filter(ImageFilter.MedianFilter(size=3))
        
        return image
    except Exception as e:
        logger.warning(f"Image preprocessing failed: {e}")
        return image

def extract_text_with_tesseract(image: Image.Image, config: str = TESSERACT_CONFIG) -> str:
    """Extract text from image using Tesseract with multiple configurations"""
    configs_to_try = [
        config,  # Custom config
        r'--oem 3 --psm 6',  # Default
        r'--oem 3 --psm 3',  # Fully automatic page segmentation
        r'--oem 3 --psm 8',  # Single word
        r'--oem 3 --psm 13'  # Raw line
    ]
    
    best_text = ""
    best_confidence = 0
    
    for cfg in configs_to_try:
        try:
            # Try to get text with confidence
            try:
                data = pytesseract.image_to_data(image, config=cfg, output_type=pytesseract.Output.DICT)
                # Calculate average confidence
                confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
                avg_confidence = sum(confidences) / len(confidences) if confidences else 0
                
                # Get text
                text = pytesseract.image_to_string(image, config=cfg).strip()
                
                if text and avg_confidence > best_confidence:
                    best_text = text
                    best_confidence = avg_confidence
                    logger.info(f"Better OCR result with config '{cfg}', confidence: {avg_confidence:.2f}")
                    
            except Exception:
                # Fallback to simple text extraction
                text = pytesseract.image_to_string(image, config=cfg).strip()
                if text and len(text) > len(best_text):
                    best_text = text
                    logger.info(f"OCR result with config '{cfg}' (no confidence)")
                    
        except Exception as e:
            logger.warning(f"OCR failed with config '{cfg}': {e}")
            continue
    
    return best_text

def extract_text_from_pdf(file_bytes: bytes, max_pages: int = 50) -> str:
    """
    Extract text from PDF with robust error handling
    
    Args:
        file_bytes: PDF file as bytes
        max_pages: Maximum number of pages to process (prevents memory issues)
    
    Returns:
        Extracted text or empty string if failed
    """
    if not file_bytes:
        logger.error("Empty PDF file bytes provided")
        return ""
    
    extracted_text = ""
    
    # Method 1: Try direct text extraction with PyPDF2
    try:
        logger.info("Attempting direct PDF text extraction...")
        pdf_stream = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_stream)
        
        if len(reader.pages) == 0:
            logger.warning("PDF has no pages")
            return ""
        
        # Limit pages to prevent memory issues
        pages_to_process = min(len(reader.pages), max_pages)
        if len(reader.pages) > max_pages:
            logger.warning(f"PDF has {len(reader.pages)} pages, processing only first {max_pages}")
        
        text_parts = []
        for i, page in enumerate(reader.pages[:pages_to_process]):
            try:
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text_parts.append(page_text.strip())
                    logger.debug(f"Extracted text from page {i+1}")
                else:
                    logger.debug(f"No text found on page {i+1}")
            except Exception as e:
                logger.warning(f"Failed to extract text from page {i+1}: {e}")
                continue
        
        extracted_text = "\n".join(text_parts)
        
        if extracted_text.strip():
            logger.info(f"Successfully extracted {len(extracted_text)} characters via direct extraction")
            return extracted_text
        else:
            logger.info("No text extracted via direct method, trying OCR...")
            
    except Exception as e:
        logger.warning(f"Direct PDF text extraction failed: {e}")
    
    # Method 2: Fallback to OCR
    try:
        logger.info("Converting PDF to images for OCR...")
        
        # Convert PDF to images with error handling
        try:
            images = convert_from_bytes(
                file_bytes,
                dpi=300,  # Higher DPI for better OCR
                first_page=1,
                last_page=min(max_pages, 20),  # Limit OCR pages
                poppler_path=None,  # Uses system poppler
                fmt='PNG'
            )
            logger.info(f"Successfully converted {len(images)} pages to images")
        except Exception as e:
            logger.error(f"Failed to convert PDF to images: {e}")
            return ""
        
        if not images:
            logger.error("No images generated from PDF")
            return ""
        
        # Check if Tesseract is available
        if not check_tesseract_installation():
            return "Error: Tesseract OCR not installed or not found in PATH"
        
        # Process each image
        ocr_text_parts = []
        for i, img in enumerate(images):
            try:
                logger.debug(f"Processing image {i+1}/{len(images)} for OCR...")
                
                # Preprocess image for better OCR
                processed_img = preprocess_image(img)
                
                # Extract text
                page_text = extract_text_with_tesseract(processed_img)
                
                if page_text.strip():
                    ocr_text_parts.append(page_text.strip())
                    logger.debug(f"Extracted {len(page_text)} characters from page {i+1}")
                else:
                    logger.debug(f"No text found on page {i+1} via OCR")
                    
            except Exception as e:
                logger.warning(f"OCR failed for page {i+1}: {e}")
                continue
        
        ocr_text = "\n".join(ocr_text_parts)
        
        if ocr_text.strip():
            logger.info(f"Successfully extracted {len(ocr_text)} characters via OCR")
            return ocr_text
        else:
            logger.warning("No text extracted via OCR")
            return ""
            
    except Exception as e:
        logger.error(f"PDF OCR processing failed: {e}")
        return ""

def extract_text_from_image(file_bytes: bytes) -> str:
    """
    Extract text from image with robust error handling
    
    Args:
        file_bytes: Image file as bytes
    
    Returns:
        Extracted text or empty string if failed
    """
    if not file_bytes:
        logger.error("Empty image file bytes provided")
        return ""
    
    try:
        # Check if Tesseract is available
        if not check_tesseract_installation():
            return "Error: Tesseract OCR not installed or not found in PATH"
        
        logger.info("Processing image for text extraction...")
        
        # Load image
        try:
            image = Image.open(io.BytesIO(file_bytes))
            logger.info(f"Image loaded: {image.size} pixels, mode: {image.mode}")
        except Exception as e:
            logger.error(f"Failed to load image: {e}")
            return ""
        
        # Handle different image formats
        if image.format == 'HEIC':
            try:
                # Convert HEIC to RGB
                image = image.convert('RGB')
                logger.info("Converted HEIC to RGB")
            except Exception as e:
                logger.error(f"Failed to convert HEIC: {e}")
                return ""
        
        # Validate image
        if image.size[0] < 10 or image.size[1] < 10:
            logger.error("Image too small for OCR")
            return ""
        
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Extract text with multiple methods
        extracted_text = extract_text_with_tesseract(processed_image)
        
        if extracted_text.strip():
            logger.info(f"Successfully extracted {len(extracted_text)} characters from image")
            return extracted_text
        else:
            logger.warning("No text found in image")
            return ""
            
    except Exception as e:
        logger.error(f"Image text extraction failed: {e}")
        return ""

def validate_ocr_dependencies() -> dict:
    """Validate all OCR dependencies"""
    status = {
        "tesseract": False,
        "poppler": False,
        "pillow": False,
        "pypdf2": False
    }
    
    # Check Tesseract
    status["tesseract"] = check_tesseract_installation()
    
    # Check Poppler (for pdf2image)
    try:
        convert_from_bytes(b'dummy', dpi=150)
    except Exception as e:
        if "poppler" in str(e).lower():
            logger.warning("Poppler not found for PDF to image conversion")
        else:
            status["poppler"] = True
    
    # Check PIL
    try:
        Image.new('RGB', (1, 1))
        status["pillow"] = True
    except Exception:
        pass
    
    # Check PyPDF2
    try:
        PdfReader(io.BytesIO(b'dummy'))
    except Exception as e:
        if "not a PDF file" in str(e):
            status["pypdf2"] = True
    
    return status

# Test dependencies on import
if __name__ == "__main__":
    print("Testing OCR dependencies...")
    deps = validate_ocr_dependencies()
    for dep, available in deps.items():
        status = "✅" if available else "❌"
        print(f"{status} {dep}: {'Available' if available else 'Not available'}")