'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DnaInputPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'upload'
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('Parsing FASTA...');
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  // Live sequence stats
  const [sequenceLength, setSequenceLength] = useState(0);
  const [hasNonStandard, setHasNonStandard] = useState(false);

  useEffect(() => {
    if (activeTab === 'paste' && pastedText) {
      // Remove header if present
      let seqOnly = pastedText.trim();
      if (seqOnly.startsWith('>')) {
        const lines = seqOnly.split('\n');
        seqOnly = lines.slice(1).join('');
      }
      
      // Clean: keep only letters
      const cleaned = seqOnly.replace(/[^A-Za-z]/g, '');
      setSequenceLength(cleaned.length);

      // Check if it contains characters other than standard DNA/RNA bases (A,T,C,G,U,N)
      const cleanedBases = seqOnly.replace(/\s+/g, '').toUpperCase();
      const hasForeign = /[^ATCGLU\s\r\n\d>N-]/i.test(cleanedBases); // Allowing standard alignments marks like -
      setHasNonStandard(hasForeign);
    } else {
      setSequenceLength(0);
      setHasNonStandard(false);
    }
  }, [pastedText, activeTab]);

  // Loading status messages cycler
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      const statuses = [
        'Parsing FASTA headers...',
        'Filtering nucleotide sequences...',
        'Running sequence alignment scan...',
        'Matching genomic disease markers...',
        'Querying Ensembl database API...',
        'Finalizing structural analysis...'
      ];
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % statuses.length;
        setAnalysisStatus(statuses[index]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = ['.fasta', '.fa', '.txt', '.seq'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExt) {
      setError('Invalid file type. Please upload a FASTA file (.fasta, .fa, .txt, .seq)');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Submit flow
  const handleAnalyze = async () => {
    setError(null);
    let fileToUpload = null;

    if (activeTab === 'paste') {
      const trimmed = pastedText.trim();
      if (!trimmed) {
        setError('Please paste a DNA or RNA sequence to analyze.');
        return;
      }

      // Convert paste to FASTA format text
      let fastaText = trimmed;
      if (!fastaText.startsWith('>')) {
        fastaText = `>BioLens Pasted Sequence\n${fastaText}`;
      }

      // Create synthetic file from blob
      const blob = new Blob([fastaText], { type: 'text/plain' });
      fileToUpload = new File([blob], 'pasted_sequence.fasta', { type: 'text/plain' });
    } else {
      if (!selectedFile) {
        setError('Please drag & drop or select a FASTA file to analyze.');
        return;
      }
      fileToUpload = selectedFile;
    }

    // Trigger loading
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('fastaFile', fileToUpload);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiBase}/api/analysis/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to complete sequence analysis.');
      }

      // Successful analysis! Route to results
      router.push(`/results?id=${result.data.upload._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server connection failed. Make sure your backend server is running on port 5000.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 px-4 sm:px-6">
      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl transition-all duration-300">
          {/* Glowing Helix Animation */}
          <div className="relative flex items-center justify-center w-28 h-28">
            <div className="absolute w-20 h-20 rounded-full border-4 border-slate-100 border-t-orange-500 animate-spin" />
            <div className="absolute w-14 h-14 rounded-full border-4 border-slate-100 border-b-indigo-500 animate-spin" style={{ animationDirection: 'reverse' }} />
            <svg
              className="w-8 h-8 text-orange-500 animate-pulse"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0 0l-3-3m3 3l3-3" />
            </svg>
          </div>
          
          <h3 className="mt-6 text-xl font-bold text-slate-800 animate-pulse">{analysisStatus}</h3>
          <p className="mt-2 text-sm text-slate-500">Aligning sequence and querying ClinVar/Ensembl databases...</p>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-100 overflow-hidden">
        {/* Tab selection header */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2">
          <button
            onClick={() => { setActiveTab('paste'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'paste'
                ? 'bg-white text-orange-600 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Paste Sequence
          </button>
          
          <button
            onClick={() => { setActiveTab('upload'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-orange-600 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            Upload FASTA
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'paste' ? (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full min-h-[180px] p-4 text-sm font-mono border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-slate-400 bg-slate-50/20 text-slate-800"
                  placeholder="Paste your DNA sequence here (e.g., ACTTGCGAT...) or FASTA format starting with >header..."
                />
                
                {/* Clear text button */}
                {pastedText && (
                  <button
                    onClick={() => setPastedText('')}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Text area validation stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">Length:</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono text-slate-700 font-bold">
                    {sequenceLength.toLocaleString()} bp
                  </span>
                </div>

                {hasNonStandard && (
                  <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100/50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>Non-nucleotide bases detected (analyzing as protein sequence/raw text)</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-orange-500 bg-orange-50/20'
                    : selectedFile
                    ? 'border-emerald-500 bg-emerald-50/5'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".fasta,.fa,.txt,.seq"
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-800 max-w-md truncate">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="mt-2 text-xs font-semibold text-rose-500 hover:text-rose-700 underline"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-slate-100 text-slate-500 rounded-full group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Drag and drop your sequence file here</span>
                    <span className="text-xs text-slate-400">Supports .fasta, .fa, .seq, .txt (Max 10MB)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action block */}
          <div className="mt-6 flex flex-col items-center border-t border-slate-100 pt-6">
            {error && (
              <div className="w-full mb-4 flex items-start gap-2.5 bg-rose-50 border border-rose-100/50 p-3 rounded-lg text-xs text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-10 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/10 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Analyze Genome Sequence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
