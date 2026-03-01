from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import os

class DeepSeekRefiner:
    def __init__(self, llm_name=None):
        print("🔄 Loading model for answer refinement...")
        
        # Check if CUDA is available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}")
        
        # Use models better suited for text refinement tasks
        if llm_name is None:
            if device == "cuda":
                # T5-based models are better for text refinement
                llm_name = "google/flan-t5-base"
            else:
                # For CPU, try these in order of preference
                model_options = [
                    "google/flan-t5-small",     # Best for refinement tasks
                    "t5-small",                 # Alternative T5 model
                    "facebook/bart-base",       # Good for text improvement
                    "microsoft/DialoGPT-small"  # Fallback conversational model
                ]
                
                for model_option in model_options:
                    try:
                        print(f"Trying {model_option}...")
                        # Test if model can be loaded
                        test_tokenizer = AutoTokenizer.from_pretrained(model_option)
                        llm_name = model_option
                        print(f"Selected: {model_option}")
                        break
                    except Exception as e:
                        print(f"Failed to load {model_option}: {str(e)[:50]}...")
                        continue
                
                if llm_name is None:
                    raise Exception("Could not load any suitable refinement model")
        
        print(f"Loading model: {llm_name}")
        
        # Load tokenizer
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(llm_name)
            
            # Add padding token if it doesn't exist
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
                
        except Exception as e:
            print(f"❌ Error loading tokenizer: {e}")
            # Fallback to GPT-2
            print("🔄 Falling back to GPT-2...")
            llm_name = "gpt2"
            self.tokenizer = AutoTokenizer.from_pretrained(llm_name)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
        
        # Load model with better error handling and model-specific settings
        try:
            # Check if this is a T5-based model (better for refinement)
            if "t5" in llm_name.lower():
                # Use Seq2Seq model for T5-based models
                from transformers import AutoModelForSeq2SeqLM
                self.model = AutoModelForSeq2SeqLM.from_pretrained(
                    llm_name,
                    torch_dtype=torch.float32 if device == "cpu" else torch.float16,
                    low_cpu_mem_usage=True
                )
                self.model_type = "seq2seq"
            else:
                # Use Causal LM for other models
                if device == "cpu":
                    self.model = AutoModelForCausalLM.from_pretrained(
                        llm_name,
                        torch_dtype=torch.float32,
                        low_cpu_mem_usage=True,
                        trust_remote_code=True
                    )
                else:
                    self.model = AutoModelForCausalLM.from_pretrained(
                        llm_name,
                        torch_dtype=torch.float16,
                        device_map="auto",
                        trust_remote_code=True,
                        offload_folder="./offload",
                        low_cpu_mem_usage=True
                    )
                self.model_type = "causal"
                
        except Exception as e:
            print(f"❌ Error loading model {llm_name}: {e}")
            print("🔄 Trying GPT-2 as final fallback...")
            llm_name = "gpt2"
            self.tokenizer = AutoTokenizer.from_pretrained(llm_name)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            self.model = AutoModelForCausalLM.from_pretrained(llm_name)
            self.model_type = "causal"
        
        # Create pipeline with model-specific configuration
        try:
            if self.model_type == "seq2seq":
                # T5-based models work better with text2text generation
                self.pipe = pipeline(
                    "text2text-generation",
                    model=self.model,
                    tokenizer=self.tokenizer,
                    max_new_tokens=128,
                    temperature=0.7,
                    do_sample=True,
                    top_p=0.9
                )
            else:
                # Causal LM models
                self.pipe = pipeline(
                    "text-generation",
                    model=self.model,
                    tokenizer=self.tokenizer,
                    max_new_tokens=128,
                    temperature=0.7,
                    top_p=0.9,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                    return_full_text=False
                )
            
            print(f"✅ Model {llm_name} loaded successfully for refinement")
            self.model_name = llm_name
            
        except Exception as e:
            print(f"❌ Error creating pipeline: {e}")
            raise

    def refine(self, query, raw_answer):
        """
        Refine a raw answer into a polished response
        
        Args:
            query (str): The original question
            raw_answer (str): The raw answer to be refined
            
        Returns:
            str: The refined answer
        """
        
        # Create different prompts based on model type
        if hasattr(self, 'model_type') and self.model_type == "seq2seq":
            # T5-style prompt (simpler for seq2seq models)
            prompt = f"Improve this medical answer to make it clearer and more natural: {raw_answer}"
        else:
            # Causal LM prompt
            prompt = f"""Rewrite this medical information into a clear, natural sentence that directly answers the question.

Question: {query}
Medical Information: {raw_answer}

Improved Answer:"""
        
        try:
            # Generate response based on model type
            if hasattr(self, 'model_type') and self.model_type == "seq2seq":
                # T5 models handle text-to-text generation differently
                response = self.pipe(prompt, max_length=200, num_return_sequences=1)
                if isinstance(response, list) and len(response) > 0:
                    refined_answer = response[0]["generated_text"].strip()
                else:
                    refined_answer = str(response).strip()
            else:
                # Causal LM models
                response = self.pipe(prompt, max_new_tokens=128)[0]["generated_text"]
                
                # Clean up the response - extract only the improved answer
                if "Improved Answer:" in response:
                    refined_answer = response.split("Improved Answer:")[-1].strip()
                elif "Answer:" in response:
                    refined_answer = response.split("Answer:")[-1].strip()
                else:
                    refined_answer = response.strip()
            
            # Validate the refined answer
            if self._is_valid_refined_answer(refined_answer, raw_answer):
                return refined_answer
            else:
                print("⚠️ Refined answer appears invalid, using original")
                return raw_answer
            
        except Exception as e:
            print(f"❌ Error during refinement: {e}")
            return raw_answer  # Return original answer if refinement fails

    def _is_valid_refined_answer(self, refined_answer, raw_answer):
        """Check if the refined answer is valid and better than the original"""
        
        # Check for common failure patterns
        if not refined_answer or len(refined_answer.strip()) < 10:
            return False
        
        # Check for garbage output (repetitive symbols)
        if any(char * 10 in refined_answer for char in ['‡', '*', '#', '=', '-', '_']):
            return False
        
        # Check for nonsensical repetition
        words = refined_answer.split()
        if len(words) > 5:
            unique_words = set(words)
            if len(unique_words) / len(words) < 0.3:  # Too much repetition
                return False
        
        # Check if answer is just repeating the prompt
        if "Question:" in refined_answer or "Medical Information:" in refined_answer:
            return False
        
        # Check if it's significantly longer than original without adding value
        if len(refined_answer) > len(raw_answer) * 3:
            return False
        
        return True

    def cleanup(self):
        """Clean up GPU memory"""
        if hasattr(self, 'model'):
            del self.model
        if hasattr(self, 'pipe'):
            del self.pipe
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print("🧹 Memory cleaned up")

# Example usage
if __name__ == "__main__":
    try:
        refiner = DeepSeekRefiner()
        
        # Test the refiner
        query = "What is the treatment for high blood pressure?"
        raw_answer = "ACE inhibitors, diuretics, lifestyle changes recommended"
        
        refined = refiner.refine(query, raw_answer)
        print(f"Original: {raw_answer}")
        print(f"Refined: {refined}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'refiner' in locals():
            refiner.cleanup()