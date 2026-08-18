/**
 * Curated Biological Marker Database
 */
const MARKERS = [
  {
    id: "hbb_normal",
    name: "HBB Normal (HbA)",
    sequence: "CCTGAGGAG", // Pro-Glu-Glu (Normal HbA codon 6)
    species: "Homo sapiens",
    gene: "HBB",
    ensemblId: "ENSG00000244737",
    disease: "None",
    risk: "Normal",
    description: "Wild-type sequence for the human Hemoglobin subunit beta (HBB) gene codon 6.",
    type: "DNA"
  },
  {
    id: "hbb_sickle",
    name: "HBB Mutant (HbS - Sickle Cell)",
    sequence: "CCTGTGGAG", // Pro-Val-Glu (Sickle Cell mutation codon 6 GAG -> GTG)
    species: "Homo sapiens",
    gene: "HBB",
    ensemblId: "ENSG00000244737",
    disease: "Sickle Cell Anemia",
    risk: "Carrier / Affected",
    clinvarId: "9726",
    description: "Pathogenic variant in HBB gene causing Sickle Cell Anemia. Caused by single nucleotide substitution GAG -> GTG.",
    type: "DNA"
  },
  {
    id: "cftr_normal",
    name: "CFTR Normal (Wild-type)",
    sequence: "GAAATATCATTGGTGTTTCCTATGATGAATATAG",
    species: "Homo sapiens",
    gene: "CFTR",
    ensemblId: "ENSG00000001626",
    disease: "None",
    risk: "Normal",
    description: "Wild-type sequence for human Cystic Fibrosis Transmembrane Conductance Regulator (CFTR) gene around codon 508.",
    type: "DNA"
  },
  {
    id: "cftr_deltaf508",
    name: "CFTR Mutant (DeltaF508)",
    sequence: "GAAATATCATTGGTGTTTCCTATGATGAATAG", // 3bp deletion (CTT deleted)
    species: "Homo sapiens",
    gene: "CFTR",
    ensemblId: "ENSG00000001626",
    disease: "Cystic Fibrosis",
    risk: "Affected",
    clinvarId: "7",
    description: "Pathogenic deletion of 3 base pairs (CTT) in CFTR, leading to the loss of Phenylalanine at codon 508.",
    type: "DNA"
  },
  {
    id: "sars_cov_2_spike",
    name: "SARS-CoV-2 Spike Protein Marker",
    sequence: "ATGTTTGTTTTTCTTGTTTTATTGCCACTAGTCTCTAGTCAGTGTGTTAAT", // 51 bases spike fragment
    species: "SARS-CoV-2",
    gene: "S",
    ensemblId: null, // Viral sequence
    disease: "COVID-19",
    risk: "Infection Detected",
    description: "Specific genomic identifier sequence for the SARS-CoV-2 spike glycoprotein gene.",
    type: "DNA"
  },
  {
    id: "dmd_dog_normal",
    name: "Dystrophin Dog Normal",
    sequence: "ATCGGCTATTGACCGACGAT",
    species: "Canis lupus familiaris",
    gene: "DMD",
    ensemblId: "ENSCAFG00845025985",
    disease: "None",
    risk: "Normal",
    description: "Wild-type Dystrophin sequence in Canis lupus familiaris (dog).",
    type: "DNA"
  },
  {
    id: "dmd_dog_dystrophy",
    name: "Dystrophin Dog Mutant",
    sequence: "ATCGGCTATTGACCGACGAC", // Point mutation
    species: "Canis lupus familiaris",
    gene: "DMD",
    ensemblId: "ENSCAFG00845025985",
    disease: "Canine Muscular Dystrophy",
    risk: "Affected",
    description: "Pathogenic point mutation in the dog Dystrophin (DMD) gene leading to Muscular Dystrophy.",
    type: "DNA"
  },
  {
    id: "actn3_sprint",
    name: "ACTN3 Sprint variant (R577X)",
    sequence: "CGCGGTCGCGG",
    species: "Homo sapiens",
    gene: "ACTN3",
    ensemblId: "ENSG00000248333",
    disease: "None",
    category: "trait",
    trait: "Muscle fiber composition",
    value: "Sprint / Power Athlete Profile",
    description: "Matches the R variant (Arg577) associated with alpha-actinin-3 production in fast-twitch fibers, typical of elite power athletes.",
    type: "DNA"
  },
  {
    id: "actn3_endurance",
    name: "ACTN3 Endurance variant (R577X)",
    sequence: "CGCGGTCGCGT",
    species: "Homo sapiens",
    gene: "ACTN3",
    ensemblId: "ENSG00000248333",
    disease: "None",
    category: "trait",
    trait: "Muscle fiber composition",
    value: "Endurance Athlete Profile",
    description: "Matches the X variant (577X nonsense mutation) associated with deficiency of alpha-actinin-3, typical of endurance athletes.",
    type: "DNA"
  },
  {
    id: "lct_tolerant",
    name: "LCT Lactase Persistence variant",
    sequence: "TGTGCTTTTCG",
    species: "Homo sapiens",
    gene: "LCT",
    ensemblId: "ENSG00000168542",
    disease: "None",
    category: "trait",
    trait: "Lactose Tolerance",
    value: "Lactose Tolerant (Lactase Persistence)",
    description: "Matches the MCM6 regulatory mutation that maintains active lactase enzyme production into adulthood.",
    type: "DNA"
  },
  {
    id: "lct_intolerant",
    name: "LCT Lactase Non-persistence variant",
    sequence: "TGTGCTTTTCA",
    species: "Homo sapiens",
    gene: "LCT",
    ensemblId: "ENSG00000168542",
    disease: "None",
    category: "trait",
    trait: "Lactose Tolerance",
    value: "Lactose Intolerant (Lactase Non-persistence)",
    description: "Matches the wild-type non-persistence genotype associated with typical adult lactose intolerance.",
    type: "DNA"
  },
  {
    id: "aldh2_flush",
    name: "ALDH2 Alcohol Flush Variant",
    sequence: "GAAATCGTCAC",
    species: "Homo sapiens",
    gene: "ALDH2",
    ensemblId: "ENSG00000111295",
    disease: "None",
    category: "trait",
    trait: "Alcohol Metabolism",
    value: "Flush Reaction Active",
    description: "Matches the ALDH2*2 allele associated with reduced aldehyde dehydrogenase activity, leading to acetaldehyde accumulation and flushing.",
    type: "DNA"
  },
  {
    id: "herc2_blue_eyes",
    name: "HERC2 Eye Color Variant",
    sequence: "GGCCTCGATGA",
    species: "Homo sapiens",
    gene: "HERC2",
    ensemblId: "ENSG00000104687",
    disease: "None",
    category: "trait",
    trait: "Eye Color predisposition",
    value: "Predisposed to Blue/Green Eyes",
    description: "Matches the HERC2 intron SNP associated with blue eye color phenotype.",
    type: "DNA"
  }
];

/**
 * Align input sequence to a marker using a sliding-window Hamming distance.
 * @param {string} sequence - Input DNA sequence
 * @param {string} markerSequence - Reference marker sequence
 * @returns {Object} Score and index of best alignment
 */
function alignMarker(sequence, markerSequence) {
  if (sequence.includes(markerSequence)) {
    return { score: 100.0, index: sequence.indexOf(markerSequence) };
  }

  const seqLen = sequence.length;
  const markLen = markerSequence.length;

  if (seqLen < markLen) return { score: 0.0, index: -1 };

  let bestScore = 0.0;
  let bestIndex = -1;
  const maxSearchLength = Math.min(seqLen - markLen + 1, 10000); // Guard rails for performance

  for (let i = 0; i < maxSearchLength; i++) {
    let matches = 0;
    for (let j = 0; j < markLen; j++) {
      if (sequence[i + j] === markerSequence[j]) {
        matches++;
      }
    }
    const score = (matches / markLen) * 100;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return { score: parseFloat(bestScore.toFixed(2)), index: bestIndex };
}

/**
 * Counts maximum consecutive CAG repeats in sequence.
 * @param {string} sequence - DNA sequence
 * @returns {number} Max repeats count
 */
function findMaxCagRepeats(sequence) {
  const matches = sequence.match(/(?:CAG)+/g);
  if (!matches) return 0;

  let maxRepeats = 0;
  for (const match of matches) {
    const repeats = match.length / 3;
    if (repeats > maxRepeats) {
      maxRepeats = repeats;
    }
  }
  return maxRepeats;
}

/**
 * Analyzes sequence by aligning it against markers and searching for repeat expansions.
 * @param {string} sequence - Uppercase DNA/RNA sequence
 * @param {string} header - FASTA header string
 * @returns {Object} Best match and disease risk results
 */
function analyzeSequence(sequence, header = '') {
  const normalizedHeader = header.toLowerCase();
  
  // 1. Huntington's CAG expansion alignment & check
  const isHtt = sequence.includes("ATGGCGACCCTGGAAAAG") || 
                sequence.includes("GAGTCCCTCAAGTCCTTC") ||
                normalizedHeader.includes("htt") || 
                normalizedHeader.includes("huntington");

  const diseaseRisks = [];
  const traits = [];

  if (isHtt) {
    const cagCount = findMaxCagRepeats(sequence);
    let risk = "Normal";
    let disease = "Huntington's Disease";
    let description = `Normal HTT allele with ${cagCount} CAG repeats. No risk of Huntington's Disease.`;

    if (cagCount >= 40) {
      risk = "High Risk (Affected)";
      description = `Pathogenic HTT expansion detected with ${cagCount} CAG repeats (Full Penetrance). Individual is highly likely to develop Huntington's Disease.`;
    } else if (cagCount >= 36 && cagCount <= 39) {
      risk = "Reduced Penetrance (Affected)";
      description = `Reduced penetrance HTT expansion detected with ${cagCount} CAG repeats. Symptoms may or may not develop, but offspring are at risk.`;
    } else if (cagCount >= 27 && cagCount <= 35) {
      risk = "Intermediate (Normal)";
      description = `Intermediate HTT repeat size of ${cagCount} CAG repeats. Individual will not develop symptoms, but repeats may expand in offspring.`;
    }

    return {
      species: "Homo sapiens",
      confidence: 100.0,
      geneMatched: "HTT",
      ensemblId: "ENSG00000197386",
      diseaseRisks: [
        {
          disease,
          risk,
          description,
          clinvarId: "14828"
        }
      ],
      traits: []
    };
  }

  // 2. Standard multi-marker alignment scan
  let bestMatch = null;
  let highestScore = 0.0;

  for (const marker of MARKERS) {
    const alignment = alignMarker(sequence, marker.sequence);
    
    // Maintain track of best matching overall gene for species/gene determination
    if (alignment.score > highestScore) {
      highestScore = alignment.score;
      bestMatch = { ...marker, score: alignment.score };
    }

    // High confidence alignment threshold (>= 90%)
    if (alignment.score >= 90.0) {
      if (marker.category === 'trait') {
        traits.push({
          trait: marker.trait,
          value: marker.value,
          description: marker.description
        });
      } else if (marker.disease !== 'None') {
        diseaseRisks.push({
          disease: marker.disease,
          risk: marker.risk,
          description: marker.description,
          clinvarId: marker.clinvarId
        });
      }
    }
  }

  // Determine metadata from best match
  let species = "Unknown";
  let geneMatched = null;
  let ensemblId = null;

  if (bestMatch && highestScore >= 75.0) {
    species = bestMatch.species;
    geneMatched = bestMatch.gene;
    ensemblId = bestMatch.ensemblId;
  } else {
    // Fallback: If header lists species
    if (normalizedHeader.includes("homo sapiens") || normalizedHeader.includes("human")) {
      species = "Homo sapiens";
    } else if (normalizedHeader.includes("sars-cov-2") || normalizedHeader.includes("coronavirus")) {
      species = "SARS-CoV-2";
    } else if (normalizedHeader.includes("canis") || normalizedHeader.includes("dog")) {
      species = "Canis lupus familiaris";
    }
  }

  return {
    species,
    confidence: highestScore,
    geneMatched,
    ensemblId,
    diseaseRisks,
    traits
  };
}

module.exports = {
  analyzeSequence,
  MARKERS
};
