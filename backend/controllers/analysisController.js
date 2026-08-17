const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Models
const DNAUpload = require('../models/DNAUpload');
const Analysis = require('../models/Analysis');

// Services
const { parseFastaFile } = require('../services/fastaParser');
const { analyzeSequence } = require('../services/blastService');
const { enrichWithEnsemblData } = require('../services/diseaseService');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.fasta';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Multer File Filter: Accept only fasta/fa/txt extensions
const fileFilter = (req, file, cb) => {
  const filetypes = /fasta|fa|txt|seq/i;
  const extname = filetypes.test(path.extname(file.originalname));
  
  if (extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Only FASTA files (.fasta, .fa, .txt, .seq) are allowed!'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('fastaFile');

/**
 * Handle FASTA file upload and execute DNA Analysis Pipeline.
 */
const uploadAndAnalyzeFasta = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a FASTA file' });
    }

    const filePath = req.file.path;
    let uploadRecord = null;

    try {
      // 1. Create a DNAUpload pending database record
      uploadRecord = await DNAUpload.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        status: 'pending'
      });

      // 2. Parse FASTA File
      const parsedFasta = await parseFastaFile(filePath);
      
      // Update upload stats
      uploadRecord.sequenceLength = parsedFasta.stats.length;
      uploadRecord.sequenceType = parsedFasta.sequenceType;
      await uploadRecord.save();

      // Validate sequence length
      if (parsedFasta.stats.length === 0) {
        throw new Error('FASTA file does not contain a valid sequence');
      }

      // 3. DNA Alignment & Mutation Matching (blastService)
      const matchResult = analyzeSequence(parsedFasta.sequence, parsedFasta.header);

      // 4. Enrich matched genes with real database info (diseaseService)
      const enrichment = await enrichWithEnsemblData(
        matchResult.ensemblId,
        matchResult.geneMatched,
        matchResult.species
      );

      // Compile all external links (combining ClinVar & Ensembl links)
      const allLinks = [...(enrichment.externalLinks || [])];
      
      // If a ClinVar ID is detected in matched disease risks, add a ClinVar database link
      if (matchResult.diseaseRisks && matchResult.diseaseRisks.length > 0) {
        matchResult.diseaseRisks.forEach(riskItem => {
          if (riskItem.clinvarId) {
            allLinks.push({
              name: `ClinVar Variation ${riskItem.clinvarId}`,
              url: `https://www.ncbi.nlm.nih.gov/clinvar/variation/${riskItem.clinvarId}/`
            });
          }
        });
      }

      // 5. Save Analysis Results to MongoDB
      const analysisRecord = await Analysis.create({
        uploadId: uploadRecord._id,
        species: matchResult.species,
        confidence: matchResult.confidence,
        sequenceType: parsedFasta.sequenceType,
        stats: parsedFasta.stats,
        geneMatched: matchResult.geneMatched,
        diseaseRisks: matchResult.diseaseRisks,
        externalDetails: {
          description: enrichment.description || 'No detailed gene annotation available.',
          location: enrichment.location || 'Unknown genomic coordinates.',
          ensemblId: enrichment.ensemblId,
          externalLinks: allLinks
        }
      });

      // 6. Update DNAUpload to Completed
      uploadRecord.status = 'completed';
      await uploadRecord.save();

      // Return full analysis details
      return res.status(200).json({
        success: true,
        message: 'FASTA file analyzed successfully',
        data: {
          upload: uploadRecord,
          analysis: analysisRecord
        }
      });

    } catch (pipelineErr) {
      console.error('[Pipeline Error]:', pipelineErr);
      
      // Clean up uploaded file if pipeline fails
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error('Failed to delete failed file:', unlinkErr);
        }
      }

      // Update upload status to failed in database
      if (uploadRecord) {
        uploadRecord.status = 'failed';
        uploadRecord.errorMessage = pipelineErr.message;
        await uploadRecord.save();
      }

      return res.status(500).json({
        success: false,
        error: pipelineErr.message || 'An error occurred during DNA analysis pipeline'
      });
    }
  });
};

/**
 * Get analysis history list (latest uploads & statuses)
 */
const getAnalysisHistory = async (req, res) => {
  try {
    const uploads = await DNAUpload.find()
      .sort({ uploadDate: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      count: uploads.length,
      data: uploads
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get detailed analysis for a specific upload ID
 */
const getAnalysisDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const uploadRecord = await DNAUpload.findById(id);
    if (!uploadRecord) {
      return res.status(404).json({ success: false, error: 'Upload record not found' });
    }

    const analysisRecord = await Analysis.findOne({ uploadId: id });
    if (!analysisRecord) {
      return res.status(404).json({ 
        success: false, 
        error: 'Analysis details not found for this upload',
        upload: uploadRecord 
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        upload: uploadRecord,
        analysis: analysisRecord
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  uploadAndAnalyzeFasta,
  getAnalysisHistory,
  getAnalysisDetails
};
