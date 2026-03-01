import requests
import logging
import time
from typing import Optional, Dict, Any, List
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

class MedicalQAConnector:
    """Connector for Medical QA API with robust error handling and retries"""
    
    def __init__(self, base_url: str = None, timeout: int = 30):
        """
        Initialize the Medical QA API connector
        
        Args:
            base_url: Base URL of the Medical QA API server
            timeout: Request timeout in seconds
        """
        self.base_url = base_url or os.getenv("MEDICAL_QA_API_URL", "http://127.0.0.1:8000")
        self.timeout = timeout
        self.session = requests.Session()
        
        # Set up session headers
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        logger.info(f"Medical QA Connector initialized with base URL: {self.base_url}")

    def test_connection(self) -> bool:
        """Test if the Medical QA API is accessible and healthy"""
        try:
            response = self.session.get(
                f"{self.base_url}/health",
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                health_data = response.json()
                is_healthy = (
                    health_data.get('status') == 'healthy' and
                    health_data.get('qa_system_loaded', False)
                )
                
                if is_healthy:
                    logger.info("✅ Medical QA API is healthy and ready")
                    return True
                else:
                    logger.warning(f"⚠️ API accessible but not healthy: {health_data}")
                    return False
            else:
                logger.error(f"❌ Health check failed with status {response.status_code}")
                return False
                
        except requests.exceptions.ConnectionError:
            logger.error(f"❌ Cannot connect to Medical QA API at {self.base_url}")
            return False
        except requests.exceptions.Timeout:
            logger.error(f"❌ Health check timed out after {self.timeout} seconds")
            return False
        except Exception as e:
            logger.error(f"❌ Health check failed: {e}")
            return False

    def extract_drugs(self, text: str, max_retries: int = 3) -> Dict[str, Any]:
        """
        Extract drug names from any text using the API
        
        Args:
            text: Text to extract drug names from
            max_retries: Maximum number of retry attempts
        
        Returns:
            Dictionary with extracted drug information or error
        """
        # Input validation
        if not text or not text.strip():
            return self._error_response("Empty text provided")
        
        # Truncate very long text
        if len(text) > 5000:
            text = text[:5000] + "...[truncated]"
            logger.warning("Text truncated due to length")
        
        payload = {"text": text.strip()}
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Extracting drugs from text (attempt {attempt + 1}/{max_retries})")
                
                response = self.session.post(
                    f"{self.base_url}/extract-drug",
                    json=payload,
                    timeout=self.timeout
                )
                
                if response.status_code == 200:
                    data = response.json()
                    logger.info(f"✅ Successfully extracted {data.get('drug_count', 0)} drugs")
                    return {
                        "success": True,
                        "text": data.get("text"),
                        "single_drug": data.get("single_drug"),
                        "all_drugs": data.get("all_drugs", []),
                        "drug_count": data.get("drug_count", 0)
                    }
                
                elif 400 <= response.status_code < 500:
                    error_data = self._parse_error_response(response)
                    error_msg = error_data.get('detail', f"Client error: {response.status_code}")
                    logger.error(f"Client error: {error_msg}")
                    return self._error_response(f"Client error: {error_msg}", response.status_code)
                
                elif response.status_code >= 500:
                    error_data = self._parse_error_response(response)
                    error_msg = error_data.get('detail', f"Server error: {response.status_code}")
                    logger.warning(f"Server error on attempt {attempt + 1}: {error_msg}")
                    
                    if attempt < max_retries - 1:
                        sleep_time = 1.0 * (2 ** attempt)  # Exponential backoff
                        logger.info(f"Retrying in {sleep_time} seconds...")
                        time.sleep(sleep_time)
                        continue
                    else:
                        return self._error_response(f"Server error after {max_retries} attempts: {error_msg}", response.status_code)
                        
            except requests.exceptions.ConnectionError:
                logger.warning(f"Connection error on attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    time.sleep(1.0)
                    continue
                else:
                    return self._error_response(f"Cannot connect to API at {self.base_url}")
            
            except requests.exceptions.Timeout:
                logger.warning(f"Request timeout on attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    time.sleep(1.0)
                    continue
                else:
                    return self._error_response(f"Request timed out after {max_retries} attempts")
            
            except Exception as e:
                logger.error(f"Unexpected error on attempt {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(1.0)
                    continue
                else:
                    return self._error_response(f"Unexpected error after {max_retries} attempts: {e}")
        
        return self._error_response("Max retries exceeded")

    def ask_question(
        self, 
        question: str, 
        use_refinement: bool = True, 
        confidence_threshold: float = 0.0,
        max_retries: int = 3, 
        retry_delay: float = 1.0
    ) -> Dict[str, Any]:
        """
        Ask a medical question with robust error handling and retries
        
        Args:
            question: The medical question to ask
            use_refinement: Whether to use AI refinement
            confidence_threshold: Minimum confidence threshold (0.0 to 1.0)
            max_retries: Maximum number of retry attempts
            retry_delay: Delay between retries in seconds
        
        Returns:
            Dictionary with response data or error information
        """
        # Input validation
        if not question or not question.strip():
            return self._error_response("Empty question provided")
        
        # Truncate very long questions
        if len(question) > 1000:
            question = question[:1000] + "...[truncated]"
            logger.warning("Question truncated due to length")
        
        # Prepare request payload
        payload = {
            "question": question.strip(),
            "use_refinement": use_refinement,
            "confidence_threshold": confidence_threshold
        }
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Sending question to Medical QA API (attempt {attempt + 1}/{max_retries})")
                
                response = self.session.post(
                    f"{self.base_url}/ask",
                    json=payload,
                    timeout=self.timeout
                )
                
                # Handle successful response
                if response.status_code == 200:
                    data = response.json()
                    logger.info("✅ Successfully received response from Medical QA API")
                    return {
                        "success": True,
                        "data": data,
                        "status_code": response.status_code
                    }
                
                # Handle client errors (4xx)
                elif 400 <= response.status_code < 500:
                    error_data = self._parse_error_response(response)
                    error_msg = error_data.get('detail', f"Client error: {response.status_code}")
                    
                    if response.status_code == 422:
                        logger.warning(f"Validation error: {error_msg}")
                        return self._error_response(f"Validation error: {error_msg}", response.status_code)
                    elif response.status_code == 503:
                        logger.error(f"Service unavailable: {error_msg}")
                        return self._error_response(f"Service unavailable: {error_msg}", response.status_code)
                    else:
                        logger.error(f"Client error: {error_msg}")
                        return self._error_response(f"Client error: {error_msg}", response.status_code)
                
                # Handle server errors (5xx) - retry these
                elif response.status_code >= 500:
                    error_data = self._parse_error_response(response)
                    error_msg = error_data.get('detail', f"Server error: {response.status_code}")
                    logger.warning(f"Server error on attempt {attempt + 1}: {error_msg}")
                    
                    if attempt < max_retries - 1:
                        sleep_time = retry_delay * (2 ** attempt)  # Exponential backoff
                        logger.info(f"Retrying in {sleep_time} seconds...")
                        time.sleep(sleep_time)
                        continue
                    else:
                        return self._error_response(f"Server error after {max_retries} attempts: {error_msg}", response.status_code)
                
                else:
                    logger.error(f"Unexpected status code: {response.status_code}")
                    return self._error_response(f"Unexpected response: {response.status_code}", response.status_code)
                    
            except requests.exceptions.ConnectionError:
                logger.warning(f"Connection error on attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    continue
                else:
                    return self._error_response(f"Cannot connect to Medical QA API at {self.base_url}")
            
            except requests.exceptions.Timeout:
                logger.warning(f"Request timeout on attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    continue
                else:
                    return self._error_response(f"Request timed out after {max_retries} attempts")
            
            except requests.exceptions.RequestException as e:
                logger.error(f"Request error on attempt {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    continue
                else:
                    return self._error_response(f"Request failed after {max_retries} attempts: {e}")
            
            except Exception as e:
                logger.error(f"Unexpected error on attempt {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    continue
                else:
                    return self._error_response(f"Unexpected error after {max_retries} attempts: {e}")
        
        return self._error_response("Max retries exceeded")

    def ask_simple(self, question: str, max_retries: int = 3) -> Dict[str, Any]:
        """
        Ask a question using the simplified endpoint
        
        Args:
            question: The medical question to ask
            max_retries: Maximum number of retry attempts
        
        Returns:
            Dictionary with simplified response data or error information
        """
        payload = {
            "question": question.strip(),
            "use_refinement": True,
            "confidence_threshold": 0.0
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/ask-simple",
                json=payload,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "question": data.get("question"),
                    "answer": data.get("answer"),
                    "confidence": data.get("confidence"),
                    "source_count": data.get("source_count", 0)
                }
            else:
                error_data = self._parse_error_response(response)
                return self._error_response(
                    error_data.get('detail', f"Error: {response.status_code}"),
                    response.status_code
                )
                
        except Exception as e:
            logger.error(f"Simple ask failed: {e}")
            return self._error_response(f"Request failed: {e}")

    def get_examples(self) -> List[str]:
        """Get example questions from the API"""
        try:
            response = self.session.get(f"{self.base_url}/examples", timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                return data.get("examples", [])
            else:
                logger.warning(f"Failed to get examples: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Failed to get examples: {e}")
            return []

    def get_system_info(self) -> Dict[str, Any]:
        """Get system information from the API"""
        try:
            response = self.session.get(f"{self.base_url}/system-info", timeout=self.timeout)
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            else:
                return self._error_response(f"Failed to get system info: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Failed to get system info: {e}")
            return self._error_response(f"System info request failed: {e}")

    def batch_ask(self, questions: List[str], use_refinement: bool = True) -> Dict[str, Any]:
        """
        Ask multiple questions in batch
        
        Args:
            questions: List of medical questions to ask
            use_refinement: Whether to use AI refinement
        
        Returns:
            Dictionary with batch response data or error information
        """
        if not questions or len(questions) == 0:
            return self._error_response("No questions provided")
        
        if len(questions) > 10:
            return self._error_response("Maximum 10 questions per batch request")
        
        # Prepare batch payload
        query_list = [
            {
                "question": q.strip(),
                "use_refinement": use_refinement,
                "confidence_threshold": 0.0
            }
            for q in questions if q.strip()
        ]
        
        try:
            response = self.session.post(
                f"{self.base_url}/batch-ask",
                json=query_list,
                timeout=self.timeout * 2  # Longer timeout for batch requests
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "data": data,
                    "question_count": len(data)
                }
            else:
                error_data = self._parse_error_response(response)
                return self._error_response(
                    error_data.get('detail', f"Batch request failed: {response.status_code}"),
                    response.status_code
                )
                
        except Exception as e:
            logger.error(f"Batch request failed: {e}")
            return self._error_response(f"Batch request failed: {e}")

    def _parse_error_response(self, response: requests.Response) -> Dict[str, Any]:
        """Parse error response from API"""
        try:
            return response.json()
        except:
            return {"detail": response.text or f"HTTP {response.status_code}"}

    def _error_response(self, message: str, status_code: int = None) -> Dict[str, Any]:
        """Create standardized error response"""
        return {
            "success": False,
            "error": message,
            "status_code": status_code,
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
        }

    def close(self):
        """Close the session"""
        if self.session:
            self.session.close()
            logger.info("Medical QA Connector session closed")

# Convenience function for simple usage
def ask_medical_question(question: str, api_url: str = None) -> str:
    """
    Simple function to ask a medical question and get just the answer text
    
    Args:
        question: The medical question to ask
        api_url: Optional API URL (uses default if not provided)
    
    Returns:
        Answer text or error message
    """
    connector = MedicalQAConnector(base_url=api_url)
    
    try:
        result = connector.ask_simple(question)
        
        if result.get("success"):
            return result.get("answer", "No answer received")
        else:
            return f"Error: {result.get('error', 'Unknown error')}"
    finally:
        connector.close()

# Convenience function for drug extraction
def extract_drugs_from_text(text: str, api_url: str = None) -> Dict[str, Any]:
    """
    Simple function to extract drug names from text
    
    Args:
        text: Text to extract drug names from
        api_url: Optional API URL (uses default if not provided)
    
    Returns:
        Dictionary with drug extraction results or error
    """
    connector = MedicalQAConnector(base_url=api_url)
    
    try:
        result = connector.extract_drugs(text)
        return result
    finally:
        connector.close()

# Test connection function
def test_medical_qa_connection(api_url: str = None) -> bool:
    """Test if Medical QA API is working"""
    connector = MedicalQAConnector(base_url=api_url)
    
    try:
        # Test connection
        if not connector.test_connection():
            return False
        
        # Test a simple question
        result = connector.ask_simple("What is aspirin used for?")
        return result.get("success", False) and "error" not in result.get("answer", "").lower()
        
    except Exception as e:
        logger.error(f"Medical QA connection test failed: {e}")
        return False
    finally:
        connector.close()

# Example usage and testing
if __name__ == "__main__":
    print("Testing Medical QA API connection...")
    
    # Test basic connection
    if test_medical_qa_connection():
        print("✅ Medical QA API is working!")
        
        # Example usage
        connector = MedicalQAConnector()
        
        try:
            # Test simple question
            print("\n📝 Testing simple question...")
            result = connector.ask_simple("What is ibuprofen used for?")
            
            if result["success"]:
                print(f"Q: What is ibuprofen used for?")
                print(f"A: {result['answer']}")
                print(f"Confidence: {result['confidence']}")
                print(f"Sources: {result['source_count']}")
            else:
                print(f"Error: {result['error']}")
            
            # Test drug extraction
            print("\n💊 Testing drug extraction...")
            drug_result = connector.extract_drugs("Patient is taking metformin and ibuprofen for diabetes and pain")
            
            if drug_result["success"]:
                print(f"Text: {drug_result['text'][:100]}...")
                print(f"First drug found: {drug_result['single_drug']}")
                print(f"All drugs found: {drug_result['all_drugs']}")
                print(f"Total drugs: {drug_result['drug_count']}")
            else:
                print(f"Drug extraction error: {drug_result['error']}")
            
            # Test full question
            print("\n🔍 Testing detailed question...")
            detailed_result = connector.ask_question(
                "What are the side effects of aspirin?",
                use_refinement=True,
                confidence_threshold=0.1
            )
            
            if detailed_result["success"]:
                data = detailed_result["data"]
                print(f"Q: {data['query']}")
                print(f"A: {data['final_answer']}")
                print(f"Confidence: {data['confidence']}")
                print(f"Processing time: {data['processing_time']}s")
                print(f"Sources found: {len(data['sources'])}")
            else:
                print(f"Error: {detailed_result['error']}")
                
        finally:
            connector.close()
            
    else:
        print("❌ Medical QA API connection failed!")
        print("Make sure your FastAPI server is running at http://127.0.0.1:8000")