'use client'

import { useState, useRef } from 'react'
import { Poppins } from 'next/font/google'
import { Upload, FileText, Pill, AlertCircle, CheckCircle, Loader, X, Edit3, Send } from 'lucide-react'

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] })

const Page = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [sendingText, setSendingText] = useState(false)
  const fileInputRef = useRef(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

  const supportedTypes = [
    '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif',
    '.webp', '.svg', '.ico', '.heic', '.heif'
  ]

  const handleFileSelect = (selectedFile) => {
    setError(null)
    setResult(null)
    if (!selectedFile) return
    const fileName = selectedFile.name.toLowerCase()
    const isSupported = supportedTypes.some(type => fileName.endsWith(type))
    if (!isSupported) {
      setError(`Unsupported file type. Supported types: ${supportedTypes.join(', ')}`)
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size too large. Maximum 10MB allowed.')
      return
    }
    setFile(selectedFile)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false) }

  const uploadFile = async () => {
    if (!file) { setError('Please select a file first'); return }
    setUploading(true); setError(null); setResult(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch(`${API_BASE_URL}/upload/`, { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || data.error || 'Upload failed')
      setResult(data)
    } catch (err) {
      setError(err.message || 'Failed to upload and process file')
    } finally {
      setUploading(false)
    }
  }

  const sendText = async () => {
    if (!textInput.trim()) { setError('Please enter some text first'); return }
    setSendingText(true); setError(null); setResult(null)
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-text/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || data.error || 'Text analysis failed')
      setResult(data)
    } catch (err) {
      setError(err.message || 'Failed to analyze text')
    } finally {
      setSendingText(false)
    }
  }

  const clearAll = () => {
    setFile(null); setResult(null); setError(null); setTextInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const isProcessing = uploading || sendingText

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">

      {/* Logo */}
      <div className="absolute top-5 left-5">
        <div className={`text-2xl font-extrabold ${poppins.className}`}>
          <span className="text-green-500">MedHe</span>
          <span className="text-black">alth.ai</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
          AI-Powered Analysis
        </div>
        <h1 className={`text-4xl font-bold text-gray-900 mb-3 ${poppins.className}`}>
          Medical{' '}
          <span className="text-green-500">OCR Analyzer</span>
        </h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          Upload prescriptions and medical documents or enter text to extract medicines and get instant analysis.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-5">

        {/* Upload Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
            <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <Upload className="w-4 h-4" />
            </span>
            Upload Document
          </h2>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
              ${dragOver
                ? 'border-green-400 bg-green-50 scale-[1.01]'
                : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
          >
            {file ? (
              <div className="space-y-3">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">{file.name}</p>
                  <p className="text-xs text-green-600 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-7 h-7 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drop your file here, or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, and more · Max 10MB</p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              accept={supportedTypes.join(',')}
              className="hidden"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadFile}
            disabled={!file || uploading}
            className={`mt-4 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${!file || uploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md shadow-green-200 hover:shadow-lg active:scale-[0.99]'
              }`}
          >
            {uploading ? (
              <><Loader className="animate-spin w-4 h-4" /> Processing document...</>
            ) : (
              <><FileText className="w-4 h-4" /> Analyze Document</>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">or enter text</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Text Input Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
            <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <Edit3 className="w-4 h-4" />
            </span>
            Enter Text Manually
          </h2>

          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter prescription text or medical document content here..."
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-vertical outline-none transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 hover:border-gray-300"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">{textInput.length} characters</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTextInput('')}
                disabled={!textInput.trim()}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:text-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={sendText}
                disabled={!textInput.trim() || sendingText}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${!textInput.trim() || sendingText
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-sm shadow-green-200 active:scale-[0.98]'
                  }`}
              >
                {sendingText ? (
                  <><Loader className="animate-spin w-3.5 h-3.5" /> Analyzing...</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Analyze Text</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Success banner */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-300 text-green-800 px-5 py-4 rounded-xl shadow-sm">
              <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <CheckCircle className="w-4 h-4" />
              </span>
              <div>
                <p className="font-semibold text-sm">Analysis complete!</p>
                <p className="text-xs text-green-600">Your document has been processed successfully.</p>
              </div>
              <button
                onClick={clearAll}
                className="ml-auto text-xs underline text-green-700 hover:text-green-900 font-medium"
              >
                Start New
              </button>
            </div>

            {/* Extracted Text */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
                <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <FileText className="w-4 h-4" />
                </span>
                Extracted Text
              </h2>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 max-h-56 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {result.extracted_text || 'No text extracted'}
                </pre>
              </div>
            </div>

            {/* Extracted Medicines */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
                <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Pill className="w-4 h-4" />
                </span>
                Extracted Medicines
                <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                  {result.extracted_medicines?.length || 0} found
                </span>
              </h2>

              {result.extracted_medicines?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.extracted_medicines.map((medicine, index) => (
                    <div key={index} className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-xl">
                      <span className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Pill className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span className="text-sm font-semibold text-green-900">{medicine}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-4">No medicines detected</p>
              )}
            </div>

            {/* Medical Analysis */}
            {result.medical_analysis && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
                  <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                  Medical Analysis
                </h2>

                {result.medical_analysis.success ? (
                  <div className="space-y-3">
                    {result.medical_analysis.analyses?.map((analysis, index) => (
                      <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border-b border-green-100">
                          <Pill className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">{analysis.medicine}</span>
                        </div>
                        {analysis.questions?.length > 0 ? (
                          <div className="divide-y divide-gray-50">
                            {analysis.questions.map((qa, qaIndex) => (
                              <div key={qaIndex} className="px-4 py-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  {qa.question}
                                </p>
                                <p className="text-sm text-gray-800 leading-relaxed">{qa.answer}</p>
                                <span className="inline-block mt-1.5 text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                                  Confidence: {qa.confidence}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic px-4 py-3">No analysis available</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Analysis Failed</p>
                      <p className="text-xs text-red-600 mt-0.5">{result.medical_analysis.error || 'Unknown error occurred'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!result && !error && !isProcessing && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className={`text-lg font-bold text-gray-800 mb-1 ${poppins.className}`}>Ready to Analyze</h3>
            <p className="text-sm text-gray-400">Upload a medical document or enter text to get started</p>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 pb-6">
          🔒 Your data is processed securely and never stored without your consent.
        </p>

      </div>
    </div>
  )
}

export default Page