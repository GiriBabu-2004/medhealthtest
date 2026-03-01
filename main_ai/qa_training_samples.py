from medical_qa_interface import MedicalQASystem
from deepseek_refiner import DeepSeekRefiner
import traceback
import sys
import time
import re

def simple_text_refiner(query, raw_answer):
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

def save_enhanced_results(query, raw_answer, final_answer, sources=None, confidence="unknown", query_type=None):
    """Save enhanced results with metadata to a file"""
    try:
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"medical_qa_results_{timestamp}.txt"
        
        with open(filename, "w", encoding="utf-8") as f:
            f.write(f"Enhanced Medical QA Results\n")
            f.write(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"{'='*60}\n\n")
            f.write(f"Query: {query}\n")
            f.write(f"Confidence Level: {confidence}\n")
            f.write(f"Query Type: {', '.join(query_type) if query_type else 'Unknown'}\n\n")
            f.write(f"Raw Answer from Medical Database:\n")
            f.write(f"{'-'*40}\n")
            f.write(f"{raw_answer}\n\n")
            f.write(f"Final Refined Answer:\n")
            f.write(f"{'-'*40}\n")
            f.write(f"{final_answer}\n\n")
            
            if sources:
                f.write(f"Sources ({len(sources)} found):\n")
                f.write(f"{'-'*40}\n")
                for i, source in enumerate(sources, 1):
                    f.write(f"{i}. Drug: {source['drug']}\n")
                    f.write(f"   Section: {source['section']}\n")
                    f.write(f"   Relevance Score: {source['score']:.3f}\n")
                    if source.get('url'):
                        f.write(f"   URL: {source['url']}\n")
                    f.write(f"\n")
            
            f.write(f"{'='*60}\n")
            
        print(f"📁 Enhanced results saved to: {filename}")
        
    except Exception as e:
        print(f"⚠️ Could not save results to file: {e}")

def cleanup_resources(qa, refiner):
    """Clean up system resources"""
    try:
        if refiner and hasattr(refiner, 'cleanup'):
            print("🧹 Cleaning up refiner resources...")
            refiner.cleanup()
        
        if qa and hasattr(qa, 'cleanup'):
            print("🧹 Cleaning up QA system resources...")
            qa.cleanup()
            
        print("✅ Resource cleanup completed")
        
    except Exception as e:
        print(f"⚠️ Error during cleanup: {e}")

def run_medical_qa():
    """Run the Medical QA system with enhanced error handling and fallbacks"""
    qa = None
    refiner = None
    
    try:
        # Initialize Medical QA System first
        print("🚀 Initializing Medical QA System...")
        qa = MedicalQASystem()
        print("✅ Medical QA System loaded successfully")
        
        # Try to initialize refiner (but don't fail if it doesn't work)
        print("\n🔄 Initializing Answer Refiner...")
        refiner_loaded = False
        
        try:
            refiner = DeepSeekRefiner(llm_name="distilgpt2")
            refiner_loaded = True
            print("✅ Answer refiner loaded successfully")
        except Exception as e:
            print(f"⚠️ Could not load refiner: {str(e)[:100]}...")
            print("📝 Will use simple text refinement instead")
            refiner = None
        
        # Process the query
        query = "Bi Apollo 10 x 15 Tablets: Rx - LOSARTAN POTASSIUM TABLETS IP 50 mg. What is the medicine for?"
        print(f"\n❓ Query: {query}")
        
        # Get answer from QA system
        qa_response = qa.generate_answer(query)
        
        if isinstance(qa_response, dict):
            raw_answer = qa_response['answer']
            sources = qa_response.get('sources', [])
            confidence = qa_response.get('confidence', 'unknown')
            query_type = qa_response.get('query_type', ['general'])
            
            print(f"\n📝 Medical Database Answer:")
            print(f"Confidence: {confidence.upper()}")
            print(f"Query Type: {', '.join(query_type)}")
            print(f"{'-'*40}")
            print(raw_answer)
            
            if sources:
                print(f"\n📚 Sources:")
                for i, source in enumerate(sources[:3], 1):
                    print(f"  {i}. {source['drug']} - {source['section']} (Score: {source['score']:.2f})")
            
            # Try refinement
            final_answer = raw_answer
            
            if refiner and raw_answer.strip():
                try:
                    print(f"\n🔄 Refining answer with AI model...")
                    refined = refiner.refine(query, raw_answer)
                    
                    # Check if refinement was successful (not repetitive/garbled)
                    if refined and len(refined) > 50 and not is_garbled_output(refined):
                        final_answer = refined
                        print(f"\n💡 AI-Refined Answer:")
                        print(f"{'-'*40}")
                        print(final_answer)
                    else:
                        print(f"⚠️ AI refinement produced poor output, using simple refinement")
                        final_answer = simple_text_refiner(query, raw_answer)
                        print(f"\n💡 Simple-Refined Answer:")
                        print(f"{'-'*40}")
                        print(final_answer)
                        
                except Exception as e:
                    print(f"❌ AI Refinement failed: {e}")
                    print(f"🔄 Using simple text refinement...")
                    final_answer = simple_text_refiner(query, raw_answer)
                    print(f"\n💡 Simple-Refined Answer:")
                    print(f"{'-'*40}")
                    print(final_answer)
            else:
                # Use simple refinement if no AI refiner
                final_answer = simple_text_refiner(query, raw_answer)
                print(f"\n💡 Simple-Refined Answer:")
                print(f"{'-'*40}")
                print(final_answer)
            
            save_enhanced_results(query, raw_answer, final_answer, sources, confidence, query_type)
                
        else:
            print(f"\n📝 Answer: {qa_response}")
            save_enhanced_results(query, qa_response, qa_response)
        
        return 0
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("💡 Make sure the following files are in the same directory:")
        print("   - medical_qa_interface.py")
        print("   - deepseek_refiner.py")
        print("   - Your FAISS index files")
        return 1
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        print("\n🔍 Full error details:")
        traceback.print_exc()
        return 1
        
    finally:
        # Cleanup resources
        cleanup_resources(qa, refiner)

def is_garbled_output(text):
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

def interactive_mode():
    """Run in interactive mode for multiple queries with enhanced features"""
    qa = None
    refiner = None
    
    try:
        # Initialize Medical QA System
        print("🚀 Initializing Enhanced Medical QA System...")
        qa = MedicalQASystem()
        
        # Try to initialize refiner
        print("\n🔄 Initializing Answer Refiner...")
        try:
            refiner = DeepSeekRefiner(llm_name="distilgpt2")
            print("✅ Answer refiner loaded successfully")
        except Exception as e:
            print(f"⚠️ Could not load refiner: {str(e)[:100]}...")
            print("📝 Running with simple text refinement only")
            refiner = None
        
        print("\n🏥 Enhanced Medical Information System Ready!")
        print("Type 'quit' to exit, 'help' for examples")
        print("="*50)
        
        while True:
            try:
                query = input("\n❓ Your medical question: ").strip()
                
                if query.lower() in ['quit', 'exit', 'q']:
                    break
                
                if query.lower() == 'help':
                    show_help_examples()
                    continue
                
                if not query:
                    print("Please enter a valid question.")
                    continue
                
                print(f"\n🔍 Processing: {query}")
                
                # Get answer from QA system
                qa_response = qa.generate_answer(query)
                
                if isinstance(qa_response, dict):
                    raw_answer = qa_response['answer']
                    sources = qa_response.get('sources', [])
                    confidence = qa_response.get('confidence', 'unknown')
                    query_type = qa_response.get('query_type', ['general'])
                    
                    print(f"\n📝 Medical Database Answer:")
                    print(f"Confidence: {confidence.upper()}")
                    print(f"Query Type: {', '.join(query_type)}")
                    print(f"{'-'*40}")
                    print(raw_answer)
                    
                    if sources:
                        print(f"\n📚 Sources:")
                        for i, source in enumerate(sources[:3], 1):
                            print(f"  {i}. {source['drug']} - {source['section']} (Score: {source['score']:.2f})")
                    
                    # Try refinement
                    final_answer = raw_answer
                    
                    if refiner and raw_answer.strip():
                        try:
                            print(f"\n🔄 Refining answer...")
                            refined = refiner.refine(query, raw_answer)
                            
                            if refined and not is_garbled_output(refined):
                                final_answer = refined
                                print(f"\n💡 AI-Refined Answer:")
                                print(f"{'-'*40}")
                                print(final_answer)
                            else:
                                print(f"⚠️ AI refinement produced poor output, using simple refinement")
                                final_answer = simple_text_refiner(query, raw_answer)
                                print(f"\n💡 Simple-Refined Answer:")
                                print(f"{'-'*40}")
                                print(final_answer)
                                
                        except Exception as e:
                            print(f"❌ Refinement failed: {e}")
                            final_answer = simple_text_refiner(query, raw_answer)
                            print(f"\n💡 Simple-Refined Answer:")
                            print(f"{'-'*40}")
                            print(final_answer)
                    else:
                        final_answer = simple_text_refiner(query, raw_answer)
                        print(f"\n💡 Simple-Refined Answer:")
                        print(f"{'-'*40}")
                        print(final_answer)
                    
                    save_enhanced_results(query, raw_answer, final_answer, sources, confidence, query_type)
                        
                else:
                    print(f"\n📝 Answer: {qa_response}")
                
                print("\n" + "="*50)
                
            except KeyboardInterrupt:
                print("\n\nExiting...")
                break
            except Exception as e:
                print(f"❌ Error processing query: {e}")
                continue
                
    except Exception as e:
        print(f"❌ System initialization failed: {e}")
    finally:
        cleanup_resources(qa, refiner)

def show_help_examples():
    """Show example queries for the medical system"""
    examples = [
        "What is Losartan used for?",
        "What are the side effects of Ibuprofen?", 
        "What is the dosage of Metformin?",
        "Who should not take Warfarin?",
        "How does Amitriptyline work?",
        "What are the warnings for Lithium?",
        "What is Losartan used for? What are its side effects? What is the dosage?",  # Compound query
    ]
    
    print("\n💡 Example questions:")
    for i, example in enumerate(examples, 1):
        print(f"  {i}. {example}")
    print()

def test_basic_functionality():
    """Test just the QA system without refinement"""
    try:
        print("🧪 Testing basic QA functionality...")
        qa = MedicalQASystem()
        
        query = "What is Losartan used for?"
        answer = qa.answer_question(query)
        
        print(f"Query: {query}")
        print(f"Answer: {answer}")
        
        if hasattr(qa, 'cleanup'):
            qa.cleanup()
            
        return True
        
    except Exception as e:
        print(f"❌ Basic test failed: {e}")
        return False

def run_qa_only():
    """Run without any refinement - just the medical QA system"""
    qa = None
    
    try:
        print("🚀 Initializing Medical QA System (QA-only mode)...")
        qa = MedicalQASystem()
        print("✅ Medical QA System loaded successfully")
        
        query = "What is Losartan used for? What are the side effects? What is the dosage?"
        print(f"\n❓ Query: {query}")
        
        # Get answer from QA system
        qa_response = qa.generate_answer(query)
        
        if isinstance(qa_response, dict):
            raw_answer = qa_response['answer']
            sources = qa_response.get('sources', [])
            confidence = qa_response.get('confidence', 'unknown')
            query_type = qa_response.get('query_type', ['general'])
            
            print(f"\n📝 Medical Database Answer:")
            print(f"Confidence: {confidence.upper()}")
            print(f"Query Type: {', '.join(query_type)}")
            print(f"{'-'*40}")
            print(raw_answer)
            
            if sources:
                print(f"\n📚 Sources:")
                for i, source in enumerate(sources[:3], 1):
                    print(f"  {i}. {source['drug']} - {source['section']} (Score: {source['score']:.2f})")
            
            # Apply simple refinement
            final_answer = simple_text_refiner(query, raw_answer)
            print(f"\n💡 Cleaned Answer:")
            print(f"{'-'*40}")
            print(final_answer)
            
            save_enhanced_results(query, raw_answer, final_answer, sources, confidence, query_type)
                
        else:
            print(f"\n📝 Answer: {qa_response}")
        
        return 0
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()
        return 1
        
    finally:
        cleanup_resources(qa, None)

if __name__ == "__main__":
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--test":
            # Run basic test without model loading
            success = test_basic_functionality()
            sys.exit(0 if success else 1)
        elif sys.argv[1] == "--no-refiner":
            # Run without the AI refiner (QA + simple refinement only)
            print("Running in QA-only mode (no AI refinement)")
            exit_code = run_qa_only()
            sys.exit(exit_code)
        elif sys.argv[1] == "--interactive":
            # Run interactive mode
            interactive_mode()
            sys.exit(0)
    
    # Run full system (with fallback refinement)
    exit_code = run_medical_qa()
    sys.exit(exit_code)
#docs_medical_complete.jsonl