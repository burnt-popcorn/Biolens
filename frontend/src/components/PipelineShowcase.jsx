export default function PipelineShowcase() {
  const steps = [
    {
      id: 'parser',
      number: '01',
      title: 'FASTA Parsing & Verification',
      description: 'Ingests FASTA, FA, or raw text sequences. Filters out non-alphabetic elements, identifies sequence type (DNA, RNA, Protein), and calculates GC-content and codon distributions.',
      color: 'from-orange-500 to-amber-500',
      textColor: 'text-orange-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    },
    {
      id: 'alignment',
      number: '02',
      title: 'Genomic Alignment Scan',
      description: 'Executes a sliding-window Hamming distance matching algorithm to compare sequences against a curated index of human, canine, and viral genomic signatures with detailed alignment confidence scoring.',
      color: 'from-indigo-500 to-blue-600',
      textColor: 'text-indigo-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      )
    },
    {
      id: 'variant',
      number: '03',
      title: 'Pathogenic Variant Check',
      description: 'Identifies mutations corresponding to Sickle Cell Anemia (HBB), Cystic Fibrosis (CFTR), and Huntington\'s Disease (HTT) CAG expansions. Cross-references results directly to ClinVar and dbSNP IDs.',
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )
    },
    {
      id: 'ensembl',
      number: '04',
      title: 'Ensembl Database Enrichment',
      description: 'Integrates dynamically with the public Ensembl REST API to retrieve chromosomal coordinates, active gene annotations, and direct reference browser links for verified sequence alignments.',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 018.716 5.253M12 3a9.003 9.003 0 00-8.716 5.253m0 0A9.003 9.003 0 0112 12c2.485 0 4.5 2.015 4.5 4.5S14.485 21 12 21" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto py-16 px-6 sm:px-8 border-t border-slate-200 mt-16 bg-slate-50/30 rounded-3xl relative overflow-hidden">
      {/* Decorative dot grid inside showcase */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Heading */}
      <div className="relative text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          A Professional Bioinformatics Pipeline
        </h2>
        <p className="mt-4 text-lg text-slate-500 leading-relaxed">
          BioLens runs your uploaded genetic sequences through a modular four-stage pipeline to parse, map, identify variants, and fetch biological annotations dynamically.
        </p>
      </div>

      {/* Showcase Grid */}
      <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Card top */}
              <div className="flex items-center justify-between mb-6">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${step.color} text-white shadow-sm shadow-indigo-500/5`}>
                  {step.icon}
                </div>
                <span className="text-3xl font-extrabold text-slate-200 group-hover:text-slate-300 transition-colors">
                  {step.number}
                </span>
              </div>

              {/* Card body */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Subtle bottom indicator */}
            <div className="mt-6 flex items-center text-xs font-semibold text-orange-500/0 group-hover:text-orange-500 transition-all duration-200 gap-1 translate-x-[-4px] group-hover:translate-x-0">
              <span>View details</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative details block */}
      <div className="relative mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">College Portfolio & Interview Focus</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            By avoiding loading entire genomic reference databases (gigabytes in size) directly into MongoDB, BioLens mirrors a professional enterprise design pattern: keeping local application databases clean and delegating alignment comparisons to localized engines and biological REST APIs.
          </p>
        </div>
      </div>
    </section>
  );
}
