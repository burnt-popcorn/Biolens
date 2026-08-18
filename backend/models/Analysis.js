const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DNAUpload',
    required: true,
  },
  species: {
    type: String,
    default: 'Unknown',
  },
  confidence: {
    type: Number,
    default: 0.0,
  },
  sequenceType: {
    type: String,
    enum: ['DNA', 'RNA', 'Protein', 'Unknown'],
    default: 'Unknown',
  },
  stats: {
    length: { type: Number, default: 0 },
    gcContent: { type: Number, default: 0 },
    counts: {
      A: { type: Number, default: 0 },
      T: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
      G: { type: Number, default: 0 },
      U: { type: Number, default: 0 },
      N: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    codonFrequency: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  geneMatched: {
    type: String,
    default: null,
  },
  diseaseRisks: [
    {
      disease: { type: String, required: true },
      risk: { type: String, required: true }, // e.g. "Normal", "Carrier", "High Risk", "Infection Detected"
      description: { type: String },
      clinvarId: { type: String }, // Optional ClinVar variant reference ID
    },
  ],
  traits: [
    {
      trait: { type: String, required: true },
      value: { type: String, required: true },
      description: { type: String },
    },
  ],
  externalDetails: {
    description: { type: String },
    location: { type: String }, // Genomic coordinates, e.g. "11:5225464-5229395"
    ensemblId: { type: String },
    uniprotId: { type: String },
    externalLinks: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
