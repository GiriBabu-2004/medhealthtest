import json
import numpy as np
import pickle
import os
from sentence_transformers import SentenceTransformer
import faiss

def build_medical_index(docs_file="docs_medical_complete.jsonl", model_name="multi-qa-mpnet-base-dot-v1"):
    """Build FAISS index from JSONL drug documents"""
    
    print("🔄 Building medical knowledge index...")
    
    # 1. Load the sentence transformer model
    print(f"Loading model: {model_name}")
    embedder = SentenceTransformer(model_name)
    
    # 2. Load documents from JSONL file
    docs = []
    if not os.path.exists(docs_file):
        print(f"❌ Error: {docs_file} not found!")
        print("Please run the data collection script first.")
        return False
    
    print(f"Loading documents from {docs_file}")
    with open(docs_file, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f):
            try:
                doc = json.loads(line.strip())
                if doc.get("text", "").strip():  # Only include docs with text
                    docs.append(doc)
            except json.JSONDecodeError:
                print(f"⚠️  Warning: Skipping malformed JSON on line {line_num + 1}")
    
    if not docs:
        print("❌ No valid documents found!")
        return False
    
    print(f"✅ Loaded {len(docs)} documents")
    
    # 3. Extract text and create embeddings
    print("Creating embeddings...")
    texts = [doc["text"] for doc in docs]
    
    # Create embeddings in batches to handle large datasets
    batch_size = 32
    all_embeddings = []
    
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i + batch_size]
        batch_embeddings = embedder.encode(
            batch_texts, 
            show_progress_bar=True,
            convert_to_numpy=True,
            batch_size=batch_size
        )
        all_embeddings.append(batch_embeddings)
    
    # Combine all embeddings
    embeddings = np.vstack(all_embeddings)
    print(f"✅ Created {embeddings.shape[0]} embeddings of dimension {embeddings.shape[1]}")
    
    # 4. Build FAISS index
    print("Building FAISS index...")
    dimension = embeddings.shape[1]
    
    # Use IndexFlatIP for cosine similarity (Inner Product after L2 normalization)
    index = faiss.IndexFlatIP(dimension)
    
    # Normalize embeddings for cosine similarity
    faiss.normalize_L2(embeddings)
    
    # Add embeddings to index
    index.add(embeddings.astype('float32'))
    
    print(f"✅ Built FAISS index with {index.ntotal} vectors")
    
    # 5. Save index and metadata
    print("Saving index and metadata...")
    faiss.write_index(index, "medical_docs.index")
    
    with open("medical_docs_meta.pkl", "wb") as f:
        pickle.dump(docs, f)
    
    # Save a human-readable summary
    with open("index_summary.json", "w", encoding="utf-8") as f:
        # Handle drug names
        drug_names = set()
        for doc in docs:
            if "drug_name" in doc and doc["drug_name"]:
                drug_names.add(doc["drug_name"])
        
        # Handle sections (flatten lists safely)
        sections = set()
        for doc in docs:
            if "section" in doc and doc["section"]:
                if isinstance(doc["section"], list):
                    sections.update(doc["section"])
                else:
                    sections.add(doc["section"])
        
        summary = {
             "total_documents": len(docs),
             "embedding_dimension": dimension,
             "model_name": model_name,
             "drugs_covered": list(drug_names),
             "sections_available": list(sections)
        }
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print("✅ Index building complete!")
    print(f"   - Index file: medical_docs.index")
    print(f"   - Metadata file: medical_docs_meta.pkl")
    print(f"   - Summary: index_summary.json")
    
    # Show some stats
    drugs = set(doc["drug_name"] for doc in docs)
    sections = set()
    for doc in docs:
        if "section" in doc and doc["section"]:
            if isinstance(doc['section'], list):
                sections.update(doc['section'])
            else:
                sections.add(doc['section'])
    print(f"\n📊 Dataset Statistics:")
    print(f"   - Drugs: {len(drugs)}")
    print(f"   - Sections: {len(sections)}")
    print(f"   - Total documents: {len(docs)}")
    
    return True

def test_index(query="What is acetaminophen used for?", top_k=3):
    """Test the built index with a sample query"""
    
    print(f"\n🔍 Testing with query: '{query}'")
    
    try:
        # Load the index and metadata
        index = faiss.read_index("medical_docs.index")
        with open("medical_docs_meta.pkl", "rb") as f:
            docs = pickle.load(f)
        
        # Load the same model used for indexing
        embedder = SentenceTransformer("all-MiniLM-L6-v2")
        
        # Embed the query
        query_embedding = embedder.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_embedding)
        
        # Search
        scores, indices = index.search(query_embedding.astype('float32'), top_k)
        
        print(f"\n📋 Top {top_k} results:")
        for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
            doc = docs[idx]
            print(f"\n{i+1}. [{doc['drug_name']}] {doc['section']}")
            print(f"   Score: {score:.3f}")
            print(f"   Text: {doc['text'][:200]}...")
            
    except Exception as e:
        print(f"❌ Error testing index: {e}")
        print("Make sure the index has been built successfully.")

if __name__ == "__main__":
    # Build the index
    success = build_medical_index()
    
    if success:
        # Test the index
        test_index()
        
        print("\n🎉 Setup complete! Your medical knowledge base is ready.")
        print("\nNext steps:")
        print("1. Try different queries using the test_index() function")
        print("2. Build a query interface or chatbot")
        print("3. Add more drugs to expand the knowledge base")