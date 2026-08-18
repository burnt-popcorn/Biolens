import NavBar from '../components/NavBar';
import DnaInputPanel from '../components/DnaInputPanel';
import PipelineShowcase from '../components/PipelineShowcase';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen dot-grid bg-slate-50/50">
      <NavBar />

      {/* Hero Header Section */}
      <main className="flex-grow pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center mb-10">

          
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-none">
            Analyze DNA Sequences.<br className="hidden sm:inline" />
            <span className="text-orange-500">
              Visualize Disease Risks.
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-500 leading-relaxed">
            Upload a FASTA file or paste standard DNA/RNA nucleotides to parse compositions, scan genomic markers, map disease variants, and fetch live Ensembl database annotations.
          </p>
        </div>

        {/* DNA Input Panel */}
        <DnaInputPanel />

        {/* Features Pipeline Showcase */}
        <PipelineShowcase />
      </main>

      <Footer />
    </div>
  );
}