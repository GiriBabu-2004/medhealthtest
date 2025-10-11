'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function MedicalSearch() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // ✅ Track Firebase user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleSearch = async () => {
    setError('');
    setResults(null);

    if (!user) {
      setError('Please login first.');
      return;
    }

    if (!query && !pdfFile) {
      setError('Please enter a medicine name or upload a PDF.');
      return;
    }

    setLoading(true);

    try {
      let pdfText = '';

      // Simple PDF text extraction (if uploaded)
      if (pdfFile) {
        const text = await pdfFile.text();
        pdfText = text.slice(0, 4000);
      }

      const res = await fetch('/api/medsearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userId: user.uid,
          pdfText,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Search failed.');

      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setPdfFile(null);
    setResults(null);
    setError('');
  };

  return (
    <section className="min-h-[100vh] bg-gradient-to-b from-white to-blue-50 flex flex-col items-center pt-28 pb-16 text-black px-6">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6">
        Medical Search Assistant
      </h1>

      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-xl border border-gray-100">
        {/* Search Form */}
        <div className="space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter medicine name (e.g. Paracetamol 500)"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="text-sm"
            />
            {pdfFile && (
              <p className="text-sm text-gray-600 truncate max-w-xs">
                📄 {pdfFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 mt-4 text-center font-medium">{error}</p>
        )}

        {/* Results */}
        {results && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              💊 Related Medicines
            </h2>

            {results.suggestions?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="border border-blue-100 bg-blue-50 text-blue-800 rounded-lg px-4 py-3 font-medium"
                  >
                    {s}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No similar medicines found.</p>
            )}

            {results.warnings?.length > 0 && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-600 mb-2">⚠ Warnings:</h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {results.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
