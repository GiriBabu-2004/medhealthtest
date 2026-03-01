import json
import pickle
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import re

# Load a lightweight generator model
GEN_MODEL_NAME = "google/flan-t5-large"   # or "google/flan-t5-large" if you have GPU memory
gen_tokenizer = AutoTokenizer.from_pretrained(GEN_MODEL_NAME)
gen_model = AutoModelForSeq2SeqLM.from_pretrained(GEN_MODEL_NAME)

class MedicalQASystem:
    
    def __init__(self, index_path="medical_docs.index", metadata_path="medical_docs_meta.pkl", model_name="multi-qa-mpnet-base-dot-v1"):
        """Initialize the medical Q&A system"""
        self.model_name = model_name
        self.embedder = SentenceTransformer(model_name)
        
        try:
            # Load the FAISS index
            self.index = faiss.read_index(index_path)
            print(f"✅ Loaded FAISS index with {self.index.ntotal} documents")
            
            # Load the metadata
            with open(metadata_path, "rb") as f:
                self.docs = pickle.load(f)
            print(f"✅ Loaded {len(self.docs)} document metadata entries")
            
        except Exception as e:
            raise Exception(f"Failed to load index or metadata: {e}")
    
    def search(self, query, top_k=5, min_score=0.3):
        """Search for relevant documents with improved relevance filtering"""
        # Embed the query
        query_embedding = self.embedder.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_embedding)
        
        # Search the index - get more initial results for better filtering
        search_k = max(top_k * 4, 20)  # Get 4x more results initially
        scores, indices = self.index.search(query_embedding.astype('float32'), search_k)
        
        # Extract drug name from query for better filtering
        target_drug = self._extract_drug_from_query(query)
        
        # Filter and rank results
        results = []
        query_lower = query.lower()
        
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1 or score < min_score:  # Skip invalid indices
                continue
                
            doc = self.docs[idx]
            drug_name_lower = doc['drug_name'].lower()
            
            # FIXED: Strong filtering for target drug
            if target_drug:
                target_drug_lower = target_drug.lower()
                
                # Only include results that match the target drug
                if target_drug_lower in drug_name_lower or drug_name_lower in target_drug_lower:
                    # Boost score for exact matches
                    if target_drug_lower == drug_name_lower:
                        score += 0.5  # Strong boost for exact match
                    else:
                        score += 0.3  # Moderate boost for partial match
                else:
                    # Skip non-matching drugs when we have a specific target
                    continue
            
            results.append({
                'score': float(score),
                'drug_name': doc['drug_name'],
                'section': ", ".join(doc['section']) if isinstance(doc['section'], list) else doc['section'],
                'text': doc['text'],
                'url': doc.get('url', ''),
                'source': doc.get('source', 'DailyMed')
            })
        
        # Sort by score and return top_k
        results = sorted(results, key=lambda x: x['score'], reverse=True)[:top_k]
        return results
    
    def _extract_drug_from_query(self, query):
        """FIXED: Extract drug name from query more accurately"""
        query_lower = query.lower().strip()
        
        # Remove common question words to focus on drug name
        clean_query = re.sub(r'\b(what|how|tell|me|about|of|for|is|are|the|a|an|common|recommended|important|any)\b', '', query_lower)
        clean_query = re.sub(r'[?.,!]', '', clean_query).strip()
        
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
            if drug in query_lower:
                return drug
        
        # Then check for drug-like patterns at the beginning of query
        words = clean_query.split()
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
            matches = re.findall(pattern, clean_query, re.IGNORECASE)
            if matches:
                drug_name = matches[0].strip()
                if len(drug_name) > 4:  # Avoid very short matches
                    return drug_name
        
        return None
    
    def _extract_all_drugs_from_query(self, query):
        """Extract all drug names from query for comparison queries"""
        query_lower = query.lower()
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
            if drug in query_lower and drug not in [d.lower() for d in all_drugs]:
                all_drugs.append(drug)
        
        # If we found less than 2 drugs, try pattern matching
        if len(all_drugs) < 2:
            drug_patterns = [
                r'\b(\w+(?:in|ol|ide|ate|ine|cin|xin|pam|zol|tan|pin|lol|fen|one|mycin|pril|sartan|statin))\b'
            ]
            
            for pattern in drug_patterns:
                matches = re.findall(pattern, query_lower, re.IGNORECASE)
                for match in matches:
                    if len(match.strip()) > 4:  # Avoid very short matches
                        drug_name = match.strip()
                        if drug_name not in [d.lower() for d in all_drugs]:
                            all_drugs.append(drug_name)
        
        return all_drugs
    
    def _enhance_sub_query_with_drug(self, sub_query, drug_name):
        """Add drug name to sub-queries that don't contain it"""
        if not drug_name:
            return sub_query
            
        sub_query_lower = sub_query.lower()
        drug_name_lower = drug_name.lower()
        
        # If the sub-query already contains the drug name, return as is
        if drug_name_lower in sub_query_lower:
            return sub_query
        
        # Add drug name based on query type
        if any(word in sub_query_lower for word in ['side effect', 'adverse', 'reaction']):
            return f"What are the side effects of {drug_name}?"
        elif any(word in sub_query_lower for word in ['warning', 'safety', 'important']):
            return f"What are the important warnings for {drug_name}?"
        elif any(word in sub_query_lower for word in ['dosage', 'dose']):
            return f"What is the dosage of {drug_name}?"
        elif any(word in sub_query_lower for word in ['used for', 'indication']):
            return f"What is {drug_name} used for?"
        elif any(word in sub_query_lower for word in ['contraindication', 'should not']):
            return f"Who should not take {drug_name}?"
        elif any(word in sub_query_lower for word in ['work', 'mechanism']):
            return f"How does {drug_name} work?"
        elif any(word in sub_query_lower for word in ['interaction']):
            return f"What are the drug interactions of {drug_name}?"
        else:
            # Generic enhancement - just prepend the drug name
            return f"{drug_name}: {sub_query}"
    
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
    def _split_compound_query(self, query):
        """FIXED: Split compound queries more accurately"""
        original_query = query.strip()
        
        # First, try to detect if this is actually a compound query
        compound_indicators = [
            r'\?\s*.*?\?',  # Two question marks
            r'what.*?\?\s*what',  # "What X? What Y?"
            r'what.*?\?\s*any',  # "What X? Any Y?"
            r'dosage.*?\?\s*(what|any)',  # "dosage? what/any"
            r'effects.*?\?\s*(what|any)',  # "effects? what/any"
        ]
        
        # Check if it's actually compound
        is_compound = False
        for pattern in compound_indicators:
            if re.search(pattern, query.lower()):
                is_compound = True
                break
        
        # Also check for multiple questions with "and"
        if not is_compound and ' and ' in query.lower():
            # Count question-like patterns
            question_patterns = ['what', 'how', 'any', 'which', 'when', 'where', 'why']
            pattern_count = sum(1 for pattern in question_patterns if pattern in query.lower())
            if pattern_count >= 2:
                is_compound = True
        
        if not is_compound:
            return [original_query]
        
        # Try to split by question marks first
        if '?' in query:
            potential_parts = []
            current_part = ""
            
            for char in query:
                current_part += char
                if char == '?':
                    potential_parts.append(current_part.strip())
                    current_part = ""
            
            # Add any remaining text
            if current_part.strip():
                if potential_parts:
                    potential_parts[-1] += " " + current_part.strip()
                else:
                    potential_parts.append(current_part.strip())
            
            # Validate parts
            valid_parts = []
            for part in potential_parts:
                if len(part) > 10 and any(word in part.lower() for word in ['what', 'how', 'any', 'which']):
                    if not part.endswith('?'):
                        part += '?'
                    valid_parts.append(part)
            
            if len(valid_parts) >= 2:
                return valid_parts
        
        # Fallback: split on "and" if it seems reasonable
        if ' and ' in query.lower():
            parts = query.split(' and ', 1)  # Split only on first 'and'
            if len(parts) == 2:
                part1, part2 = parts
                part1 = part1.strip()
                part2 = part2.strip()
                
                # Ensure both parts end with '?'
                if not part1.endswith('?'):
                    part1 += '?'
                if not part2.endswith('?'):
                    part2 += '?'
                
                # Try to make part2 a complete question if needed
                drug_name = self._extract_drug_from_query(part1)
                if drug_name and not any(word in part2.lower()[:10] for word in ['what', 'how', 'any', 'which']):
                    if 'side effect' in part2.lower():
                        part2 = f"What are the side effects of {drug_name}?"
                    elif 'warning' in part2.lower():
                        part2 = f"What are the warnings for {drug_name}?"
                    elif 'dosage' in part2.lower():
                        part2 = f"What is the dosage of {drug_name}?"
                
                if len(part1) > 10 and len(part2) > 10:
                    return [part1, part2]
        
        return [original_query]
    
    def _classify_query_types(self, query):
        """Classify the type(s) of medical query (can be multiple)"""
        query_lower = query.lower()
        types = []

        if any(word in query_lower for word in ['used for', 'indication', 'treat', 'purpose', 'indicated for']):
            types.append('uses')
        if any(word in query_lower for word in ['side effect', 'adverse', 'reaction', 'risk']):
            types.append('side_effects')
        if any(word in query_lower for word in ['dosage', 'dose', 'how much', 'amount']):
            types.append('dosage')
        if any(word in query_lower for word in ['contraindication', 'should not', "shouldn't", 'avoid', 'who cannot']):
            types.append('contraindications')
        if any(word in query_lower for word in ['warning', 'precaution', 'safety', 'important']):
            types.append('warnings')
        if any(word in query_lower for word in ['how does', 'work', 'mechanism', 'action']):
            types.append('mechanism')
        if any(word in query_lower for word in ['interaction', 'interact', 'combine']):
            types.append('interactions')
        if any(word in query_lower for word in ['compare', 'difference', 'versus', 'vs']):
            types.append('comparison')

        if not types:
            types.append('general')

        return types
    
    def _build_enhanced_prompt(self, query, retrieved_docs, query_type):
        """Build a more specific and detailed prompt based on query type"""
        
        # Build context from retrieved documents
        context_parts = []
        for doc in retrieved_docs:
            section_clean = doc['section'].replace('_', ' ').replace('-', ' ')
            context_parts.append(f"Drug: {doc['drug_name']}\nSection: {section_clean}\nContent: {doc['text']}")
        
        context = "\n\n".join(context_parts)
        
        # Query type specific instructions
        type_instructions = {
            'uses': "Focus on therapeutic uses, indications, and what conditions the medication treats.",
            'side_effects': "Focus on adverse reactions, side effects, and potential risks.",
            'dosage': "Focus on dosing information, administration, and recommended amounts.",
            'contraindications': "Focus on who should not take the medication and when it should be avoided.",
            'warnings': "Focus on safety warnings, precautions, and important safety information.",
            'mechanism': "Focus on how the medication works in the body and its mechanism of action.",
            'interactions': "Focus on drug interactions and what medications or substances to avoid.",
            'comparison': "Compare the medications mentioned in terms of the specific aspect asked.",
            'general': "Provide comprehensive information relevant to the question."
        }
        
        instruction = type_instructions.get(query_type, type_instructions['general'])
        
        prompt = f"""You are a knowledgeable medical information assistant. Answer the medical question using ONLY the provided context. 

INSTRUCTIONS:
- {instruction}
- Write in complete, clear sentences
- Be specific and detailed
- Always mention the drug name(s) in your answer
- If multiple drugs are relevant, address each one
- If the context doesn't contain enough information, say so clearly
- Do not make up information not in the context

CONTEXT:
{context}

QUESTION: {query}

DETAILED ANSWER:"""

        return prompt
    
    def _generate_with_model(self, query, retrieved_docs, query_type, max_tokens=512):
        """Generate a natural answer using Flan-T5 with enhanced prompting"""
        
        # Build enhanced prompt
        prompt = self._build_enhanced_prompt(query, retrieved_docs, query_type)
        
        # Tokenize & generate with better parameters
        inputs = gen_tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024)
        outputs = gen_model.generate(
            **inputs, 
            max_new_tokens=max_tokens,
            temperature=0.3,  # Lower temperature for more consistent answers
            do_sample=True,
            top_p=0.9,
            repetition_penalty=1.1
        )
        
        generated_text = gen_tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract just the answer part (remove the prompt)
        if "DETAILED ANSWER:" in generated_text:
            answer = generated_text.split("DETAILED ANSWER:")[-1].strip()
        else:
            answer = generated_text.strip()
        
        # Post-process the answer
        answer = self._post_process_answer(answer, query, retrieved_docs)
        
        return answer
    
    def _post_process_answer(self, answer, query, retrieved_docs):
        """FIXED: Post-process the generated answer to ensure quality"""
        
        # Remove any remaining prompt text
        answer = re.sub(r'^.*?DETAILED ANSWER:\s*', '', answer, flags=re.IGNORECASE)
        
        # Ensure answer starts with a capital letter
        if answer and not answer[0].isupper():
            answer = answer[0].upper() + answer[1:]
        
        # If answer is too short or generic, create a fallback answer
        if len(answer) < 20 or answer.lower().strip() in ['yes', 'no', 'unknown', 'not specified']:
            answer = self._create_fallback_answer(query, retrieved_docs)
        
        # Ensure proper sentence ending
        if answer and not answer.endswith(('.', '!', '?')):
            answer += '.'
        
        return answer
    
    def _create_fallback_answer(self, query, retrieved_docs):
        """FIXED: Create a fallback answer when generation fails"""
        if not retrieved_docs:
            return "I couldn't find specific information about this query in the medical database."
        
        # Use the most relevant document
        top_doc = retrieved_docs[0]
        drug_name = top_doc['drug_name']
        text = top_doc['text']
        
        # Create response based on query type
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['dosage', 'dose', 'how much']):
            return f"Based on the available information, the dosage for {drug_name} is: {text[:200]}..."
        elif any(word in query_lower for word in ['side effect', 'adverse', 'reaction']):
            return f"The documented side effects of {drug_name} include: {text[:200]}..."
        elif any(word in query_lower for word in ['used for', 'indication', 'treat']):
            return f"{drug_name} is indicated for: {text[:200]}..."
        elif any(word in query_lower for word in ['contraindication', 'should not', "shouldn't"]):
            return f"{drug_name} should not be used in: {text[:200]}..."
        elif any(word in query_lower for word in ['how does', 'work', 'mechanism']):
            return f"{drug_name} works by: {text[:200]}..."
        elif any(word in query_lower for word in ['warning', 'safety', 'precaution']):
            return f"Important safety information for {drug_name}: {text[:200]}..."
        
        return f"Regarding {drug_name}: {text[:200]}..."
    
    def _handle_comparison_query(self, query, results):
        """FIXED: Handle comparison queries properly"""
        # Extract all drugs mentioned in the query
        drugs_in_query = self._extract_all_drugs_from_query(query)
        
        if len(drugs_in_query) < 2:
            # Try to find drugs from results if not found in query
            unique_drugs = list(set([r['drug_name'] for r in results]))
            if len(unique_drugs) >= 2:
                drugs_in_query = unique_drugs[:2]
            else:
                # Fallback: treat as regular query
                return None
        
        comparison_results = {}
        
        # Determine what aspect to compare based on query
        comparison_aspect = 'uses'  # default
        if any(word in query.lower() for word in ['side effect', 'adverse']):
            comparison_aspect = 'side_effects'
        elif any(word in query.lower() for word in ['dosage', 'dose']):
            comparison_aspect = 'dosage'
        elif any(word in query.lower() for word in ['warning', 'safety']):
            comparison_aspect = 'warnings'
        elif any(word in query.lower() for word in ['mechanism', 'work']):
            comparison_aspect = 'mechanism'
        
        for drug in drugs_in_query[:2]:  # Compare up to 2 drugs
            # Search specifically for this drug
            drug_specific_results = self.search(f"{drug} {comparison_aspect}", top_k=5)
            
            if drug_specific_results:
                # Generate specific answer for this drug
                if comparison_aspect == 'uses':
                    specific_query = f"What is {drug} used for?"
                elif comparison_aspect == 'side_effects':
                    specific_query = f"What are the side effects of {drug}?"
                elif comparison_aspect == 'dosage':
                    specific_query = f"What is the dosage of {drug}?"
                elif comparison_aspect == 'warnings':
                    specific_query = f"What are the warnings for {drug}?"
                elif comparison_aspect == 'mechanism':
                    specific_query = f"How does {drug} work?"
                else:
                    specific_query = f"Tell me about {drug}"
                
                # Generate answer for this specific drug
                drug_answer = self._generate_with_model(specific_query, drug_specific_results[:3], comparison_aspect)
                comparison_results[drug] = drug_answer
        
        # Format comparison result
        if len(comparison_results) >= 2:
            comparison_text = []
            for drug, answer in comparison_results.items():
                comparison_text.append(f"**{drug.capitalize()}**: {answer}")
            
            return "\n\n".join(comparison_text)
        
        return None
    
    def generate_answer(self, query, max_context_length=3000):
        """FIXED: Generate an enhanced answer based on retrieved documents"""
        
        # FIRST: Extract drug name from the complete original query
        original_drug = self._extract_drug_from_query(query)
        print(f"🔍 Identified drug from query: {original_drug}")
        
        # Check if this is a compound query
        sub_queries = self._split_compound_query(query)
        
        if len(sub_queries) > 1:
            # Handle compound query - answer each part separately
            print(f"🔍 Detected compound query with {len(sub_queries)} parts")
            compound_answers = []
            all_sources = []
            all_types = []
            
            for i, sub_query in enumerate(sub_queries):
                # FIXED: Add drug name to sub-queries that don't have it
                enhanced_sub_query = self._enhance_sub_query_with_drug(sub_query, original_drug)
                print(f"  🔍 Processing part {i+1}: {enhanced_sub_query}")
                
                # Process each sub-query independently
                sub_results = self.search(enhanced_sub_query, top_k=5)
                sub_query_types = self._classify_query_types(enhanced_sub_query)
                
                # Generate answer for this sub-query
                if sub_results:
                    # Handle each query type for this sub-query
                    sub_answers = []
                    for qtype in sub_query_types:
                        if qtype == 'comparison':
                            comparison_result = self._handle_comparison_query(enhanced_sub_query, sub_results)
                            if comparison_result:
                                sub_answers.append(comparison_result)
                            continue
                        
                        filtered_results = self._filter_results_by_query_type(sub_results, qtype)
                        if not filtered_results:
                            filtered_results = sub_results[:3]
                        
                        sub_answer = self._generate_with_model(enhanced_sub_query, filtered_results, qtype)
                        sub_answers.append(sub_answer)
                        all_sources.extend(filtered_results[:2])
                    
                    part_answer = " ".join(sub_answers)  # Join without extra formatting
                else:
                    part_answer = "No relevant information found for this part."
                
                # Format the compound answer parts more cleanly (use original sub_query for display)
                compound_answers.append(f"**{i+1}. {sub_query}**\n{part_answer}")
                all_types.extend(sub_query_types)
            
            # Combine results
            final_answer = "\n\n".join(compound_answers)
            
            # Remove duplicate sources
            unique_sources = []
            seen = set()
            for source in all_sources:
                key = (source['drug_name'], source['section'])
                if key not in seen:
                    seen.add(key)
                    unique_sources.append({
                        'drug': source['drug_name'],
                        'section': source['section'],
                        'score': source['score'],
                        'url': source['url']
                    })
            
            return {
                'answer': final_answer,
                'sources': unique_sources,
                'confidence': 'high' if all_sources else 'low',
                'query_type': list(set(all_types)),
                'raw_results': []
            }
        
        # Handle single query
        results = self.search(query, top_k=8)
        query_types = self._classify_query_types(query)
        answers = []
        all_sources = []

        # Special handling for comparison queries
        if 'comparison' in query_types:
            comparison_result = self._handle_comparison_query(query, results)
            if comparison_result:
                answers.append(comparison_result)
                # Add sources from comparison
                drugs_compared = self._extract_all_drugs_from_query(query)
                for drug in drugs_compared:
                    drug_sources = [r for r in results if drug.lower() in r['drug_name'].lower()]
                    all_sources.extend(drug_sources[:2])
            else:
                # Fallback to regular processing
                query_types.remove('comparison')
                if not query_types:
                    query_types = ['general']
        
        # Process other query types
        for qtype in query_types:
            if qtype == 'comparison':
                continue  # Already handled above
                
            # Filter docs for this type
            filtered_results = self._filter_results_by_query_type(results, qtype)
            if not filtered_results:
                filtered_results = results[:3]

            # Normal generation
            sub_answer = self._generate_with_model(query, filtered_results, qtype)
            answers.append(sub_answer)
            all_sources.extend(filtered_results[:2])
        
        final_answer = " ".join(answers)  # Join without section headers for single queries
        
        # Prepare sources
        sources = []
        seen = set()
        for r in all_sources:
            key = (r['drug_name'], r['section'])
            if key not in seen:
                seen.add(key)
                sources.append({
                    'drug': r['drug_name'],
                    'section': r['section'],
                    'score': r['score'],
                    'url': r['url']
                })
        
        # Determine confidence based on top score and answer quality
        top_score = results[0]['score'] if results else 0
        answer_length = len(final_answer.split())
        
        # Better confidence calculation
        if top_score > 0.8 and answer_length > 10:
            confidence = 'high'
        elif top_score > 0.5 and answer_length > 5:
            confidence = 'medium' 
        else:
            confidence = 'low'
        
        return {
            'answer': final_answer,
            'sources': sources,
            'confidence': confidence,
            'query_type': query_types,
            'raw_results': results
        }
    
    def _filter_results_by_query_type(self, results, query_type):
        """Filter results based on query type to improve relevance"""
        
        section_keywords = {
            'uses': ['indication', 'usage', 'use', 'therapeutic'],
            'side_effects': ['adverse', 'side effect', 'reaction', 'risk'],
            'dosage': ['dosage', 'dose', 'administration', 'how to use'],
            'contraindications': ['contraindication', 'not recommended', 'should not'],
            'warnings': ['warning', 'precaution', 'safety', 'important'],
            'mechanism': ['mechanism', 'action', 'pharmacology'],
            'interactions': ['interaction', 'drug interaction'],
            'comparison': ['indication', 'usage', 'adverse', 'dosage']
        }
        
        if query_type not in section_keywords:
            return results
        
        keywords = section_keywords[query_type]
        filtered = []
        
        for result in results:
            section_lower = result['section'].lower()
            if any(keyword in section_lower for keyword in keywords):
                filtered.append(result)
        
        # If we filtered out too much, return original results
        if len(filtered) < 2:
            return results[:3]
        
        return filtered[:3]
    
    def interactive_chat(self):
        """Start an interactive chat session"""
        print("🏥 Enhanced Medical Information Q&A System")
        print("=" * 50)
        print("Ask me about medications, dosages, side effects, etc.")
        print("Type 'quit' to exit, 'help' for examples\n")
        
        while True:
            try:
                query = input("❓ Your question: ").strip()
                
                if query.lower() in ['quit', 'exit', 'q']:
                    print("Goodbye! 👋")
                    break
                
                if query.lower() == 'help':
                    self._show_examples()
                    continue
                
                if not query:
                    continue
                
                print("🔍 Searching and analyzing...")
                response = self.generate_answer(query)
                
                print(f"\n📋 Answer (Confidence: {response['confidence']}, Type: {response['query_type']}):")
                print("-" * 40)
                print(response['answer'])
                
                if response['sources']:
                    print(f"\n📚 Sources:")
                    for i, source in enumerate(response['sources'], 1):
                        print(f"{i}. {source['drug']} - {source['section']} (Score: {source['score']:.2f})")
                
                print("\n" + "="*50 + "\n")
                
            except KeyboardInterrupt:
                print("\n\nGoodbye! 👋")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    def _show_examples(self):
        """Show example queries"""
        examples = [
            "What is Losartan used for?",
            "What are the common side effects of Ibuprofen?",
            "What is the recommended dosage of Metformin for adults?",
            "Who should not take Warfarin?",
            "How does Amitriptyline work in the body?",
            "What are the important safety warnings for Lithium?",
            "Compare the uses of Paracetamol and Aspirin",
            "Is Methotrexate safe for cancer patients?",
            "What is Losartan used for? What are its side effects?",  # Compound query example
            "Compare Amlodipine and Atenolol uses"  # Comparison example
        ]
        
        print("\n💡 Example questions you can ask:")
        for i, example in enumerate(examples, 1):
            print(f"{i}. {example}")
        print()
    
    def batch_query(self, queries):
        """Process multiple queries at once"""
        results = {}
        for query in queries:
            print(f"Processing: {query}")
            results[query] = self.generate_answer(query)
        return results

def main():
    """Main function to run the enhanced Q&A system"""
    try:
        # Initialize the system
        qa_system = MedicalQASystem()
        
        # Start interactive mode
        qa_system.interactive_chat()
        
    except Exception as e:
        print(f"❌ Failed to initialize Q&A system: {e}")
        print("\nMake sure you have:")
        print("1. Run the data collection script to create docs.jsonl")
        print("2. Run the index building script to create the FAISS index")
        print("3. Installed required packages: sentence-transformers, faiss-cpu, transformers")

if __name__ == "__main__":
    main()