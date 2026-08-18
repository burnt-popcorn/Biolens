'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

export default function Results() {
  const [analysisId, setAnalysisId] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract ID from URL safely on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setAnalysisId(id);
      } else {
        setError('No sequence analysis ID provided in the URL.');
        setIsLoading(false);
      }
    }
  }, []);

  // Fetch results from Express API
  useEffect(() => {
    if (!analysisId) return;

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiBase}/api/analysis/${analysisId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to fetch analysis details.');
        }

        setData(result.data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Could not connect to the analysis backend.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [analysisId]);

  // GC Gauge SVG Helper
  const renderGcGauge = (gcContent) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const safeGc = gcContent || 0;
    const strokeDashoffset = circumference - (safeGc / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
        <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">GC Ratio</span>
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Gauge background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-slate-200"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Gauge stroke */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-orange-500 transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Absolute text */}
          <div className="absolute text-center">
            <span className="text-2xl font-black text-slate-800">{safeGc}%</span>
          </div>
        </div>
        <span className="text-xxs text-slate-500 mt-2 text-center max-w-[120px]">
          GC pairs are stabilized by triple hydrogen bonds.
        </span>
      </div>
    );
  };

  // Base counts bar chart helper
  const renderBaseChart = (counts, sequenceType) => {
    const safeCounts = counts || {};
    const bases = sequenceType === 'RNA' 
      ? ['A', 'U', 'C', 'G', 'N'] 
      : ['A', 'T', 'C', 'G', 'N'];

    const total = bases.reduce((acc, base) => acc + (safeCounts[base] || 0), 0) + (safeCounts.other || 0);

    const baseMeta = {
      A: { label: 'Adenine (A)', color: 'bg-indigo-500' },
      T: { label: 'Thymine (T)', color: 'bg-orange-500' },
      U: { label: 'Uracil (U)', color: 'bg-rose-500' },
      C: { label: 'Cytosine (C)', color: 'bg-amber-500' },
      G: { label: 'Guanine (G)', color: 'bg-emerald-500' },
      N: { label: 'Ambiguous (N)', color: 'bg-slate-400' },
      other: { label: 'Others', color: 'bg-slate-300' }
    };

    const dataItems = bases.map(base => ({
      base,
      count: safeCounts[base] || 0,
      pct: total > 0 ? (((safeCounts[base] || 0) / total) * 100).toFixed(1) : 0,
      ...baseMeta[base]
    }));

    if (safeCounts.other > 0) {
      dataItems.push({
        base: 'other',
        count: safeCounts.other,
        pct: total > 0 ? ((safeCounts.other / total) * 100).toFixed(1) : 0,
        ...baseMeta.other
      });
    }

    return (
      <div className="flex-1 p-5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nucleotide Distribution</span>
        <div className="space-y-3">
          {dataItems.map((item) => (
            <div key={item.base} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <span className="font-mono text-slate-500">{(item.count || 0).toLocaleString()} bp ({item.pct}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-200/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen dot-grid bg-slate-50/50">
      <NavBar />

      <main className="flex-grow py-12 max-w-7xl mx-auto w-full px-6 sm:px-8">
        
        {/* Back and title bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-500 mb-2 transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Analyzer
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Sequence Analysis Report
            </h1>
          </div>
          
          {analysisId && (
            <div className="text-xxs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-slate-400 select-all">
              UPLOAD ID: {analysisId}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-orange-500 animate-spin" />
            <h3 className="mt-4 text-sm font-bold text-slate-700">Loading analysis results...</h3>
            <p className="text-xs text-slate-400 mt-1">Retrieving genomic parameters from MongoDB database.</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-start gap-3 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div>
                <h3 className="font-bold text-sm">Failed to Load Report</h3>
                <p className="text-xs text-slate-600 mt-1">{error}</p>
              </div>
            </div>
            <Link 
              href="/"
              className="inline-flex px-4 py-2 bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white rounded-lg transition-all"
            >
              Return Home
            </Link>
          </div>
        )}

        {/* Loaded Content */}
        {data && (
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Overview Banner (Span full columns) */}
            <div className="lg:col-span-3 bg-gradient-to-r from-orange-50 to-indigo-50/20 border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="inline-flex px-2.5 py-0.5 text-xxs font-bold uppercase rounded-md bg-indigo-100 text-indigo-700">
                  {data?.analysis?.sequenceType || 'DNA'} Sequence
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  {data?.analysis?.species && data.analysis.species !== 'Unknown' ? (
                    <span className="italic">{data.analysis.species}</span>
                  ) : (
                    <span>Unclassified Species</span>
                  )}
                  {data?.analysis?.geneMatched && (
                    <span className="text-sm font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      Matched Gene: {data.analysis.geneMatched}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500">
                  Header: <span className="font-mono text-slate-700 break-all">{data?.upload?.originalName || 'Sequence File'}</span>
                </p>
              </div>

              <div className="flex gap-6">
                <div className="text-center bg-white border border-slate-200/50 px-4 py-2.5 rounded-xl shadow-xs">
                  <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Sequence Length</span>
                  <span className="text-lg font-black text-slate-800 font-mono">
                    {(data?.analysis?.stats?.length || 0).toLocaleString()} bp
                  </span>
                </div>
                <div className="text-center bg-white border border-slate-200/50 px-4 py-2.5 rounded-xl shadow-xs">
                  <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Alignment Score</span>
                  <span className="text-lg font-black text-orange-500 font-mono">
                    {(data?.analysis?.confidence || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Left Columns (Gene Details and Disease Risks) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Card 1: Species & Gene Information Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.263 1.27l-.042.02a.75.75 0 01-.263-1.27zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V9zM12.75 14.25a.75.75 0 00-1.5 0v.008a.75.75 0 001.5 0v-.008z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900">Genomic Reference Details</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400 block">Classified Taxa</span>
                    <span className="font-bold text-slate-800">{data?.analysis?.species || 'Unknown'}</span>
                  </div>
                  
                  {data?.analysis?.externalDetails?.ensemblId && (
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-400 block">Ensembl ID</span>
                      <span className="font-mono font-bold text-slate-800">{data.analysis.externalDetails.ensemblId}</span>
                    </div>
                  )}

                  {data?.analysis?.externalDetails?.location && (
                    <div className="space-y-1 sm:col-span-2">
                      <span className="font-semibold text-slate-400 block">Genomic Coordinates</span>
                      <span className="font-mono font-bold text-slate-800">{data.analysis.externalDetails.location}</span>
                    </div>
                  )}
                  
                  <div className="space-y-1 sm:col-span-2 border-t border-slate-100 pt-3">
                    <span className="font-semibold text-slate-400 block">Gene Functional Annotation</span>
                    <p className="text-slate-600 leading-relaxed mt-1">
                      {data?.analysis?.externalDetails?.description || 'No detailed annotation matches found in curated records.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Disease Risks Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900">Pathogenicity & Variant Risk Assessment</h3>
                </div>

                {data?.analysis?.diseaseRisks && data.analysis.diseaseRisks.length > 0 ? (
                  <div className="space-y-4">
                    {data.analysis.diseaseRisks.map((risk, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-slate-800">{risk.disease}</h4>
                          <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase ${
                            risk.risk.includes('High') || risk.risk.includes('Infection')
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {risk.risk}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>
                        
                        {risk.clinvarId && (
                          <div className="text-xxs flex items-center gap-1.5 pt-1 text-slate-400">
                            <span className="font-semibold">ClinVar Accession:</span>
                            <span className="font-mono font-bold text-slate-500">{risk.clinvarId}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-3">
                    <div className="p-1 bg-emerald-100 text-emerald-600 rounded-full flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div className="text-xs space-y-1">
                      <h4 className="font-bold text-slate-800">Wild-Type Alignment (No Variants)</h4>
                      <p className="text-slate-500 leading-relaxed">
                        The uploaded sequence aligns with the wild-type genome database marker. No pathogenic deletion, single nucleotide polymorphisms (SNPs), or CAG repeat expansions were identified in this sequence.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2.5: Genotypic Traits & Phenotypes */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.97 5.97 0 01-1.808-4.188M6 18.72a9.094 9.094 0 01-3.741-.479 3 3 0 014.682-2.72m-.94 3.198l-.002.031c0 .225.012.447.037.666A11.944 11.944 0 0012 21c2.17 0 4.207-.576 5.963-1.584A6.062 6.062 0 0018 18.722m-12 0a5.97 5.97 0 001.808-4.188M12 14.25a8.961 8.961 0 00-3-1.54M12 14.25a8.961 8.961 0 013-1.54M12 14.25v-2.25M12 12a3 3 0 100-6 3 3 0 000 6zm-7 4.875A2.625 2.625 0 117.5 12a2.625 2.625 0 01-2.5 4.875zm14 0A2.625 2.625 0 1121.5 12a2.625 2.625 0 01-2.5 4.875z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900">Genotypic Traits & Phenotypic Predispositions</h3>
                </div>

                {data?.analysis?.traits && data.analysis.traits.length > 0 ? (
                  <div className="space-y-4">
                    {data.analysis.traits.map((trait, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-orange-50/10 border border-orange-100 rounded-xl space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xxs font-bold text-orange-600 uppercase tracking-wider">
                            {trait.trait}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-850 text-xxs font-bold uppercase border border-orange-200">
                            {trait.value}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{trait.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No phenotypic trait markers matched in this sequence fragment.
                  </p>
                )}
              </div>

            </div>

            {/* Right Column (Composition Stats, Codon Frequencies, Database Links) */}
            <div className="space-y-8">
              
              {/* Card 3: Sequence Composition Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900">Sequence Composition</h3>
                </div>

                <div className="flex flex-col gap-4">
                  {renderGcGauge(data?.analysis?.stats?.gcContent || 0)}
                  {renderBaseChart(data?.analysis?.stats?.counts || {}, data?.analysis?.sequenceType || 'DNA')}
                </div>
              </div>

              {/* Card 4: Codon Frequencies Grid */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900">Codon Frequency Grid</h3>
                </div>

                {data?.analysis?.stats?.codonFrequency && Object.keys(data.analysis.stats.codonFrequency).length > 0 ? (
                  <div className="space-y-3">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Codon Occurrences (Sorted)</span>
                    
                    {/* Grid wrapper */}
                    <div className="max-h-[220px] overflow-y-auto pr-1 border border-slate-100 rounded-lg p-2 bg-slate-50/30">
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(data.analysis.stats.codonFrequency || {})
                          .sort((a, b) => b[1] - a[1]) // Sort descending
                          .map(([codon, count]) => (
                            <div 
                              key={codon}
                              className="bg-white border border-slate-150 p-2 rounded flex flex-col items-center justify-center"
                            >
                              <span className="font-mono text-xs font-bold text-slate-800">{codon}</span>
                              <span className="text-xxs text-slate-400 mt-0.5">{count}x</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Codon frequency data is only compiled for DNA/RNA nucleotide sequences.
                  </p>
                )}
              </div>

              {/* Card 5: External Database Links */}
              {data?.analysis?.externalDetails?.externalLinks && data.analysis.externalDetails.externalLinks.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900">Database Reference Links</h3>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {data.analysis.externalDetails.externalLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 hover:border-orange-200 hover:bg-orange-50/10 rounded-xl transition-all group text-xs text-slate-700 font-semibold"
                      >
                        <span className="group-hover:text-orange-600 transition-colors">{link.name}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}