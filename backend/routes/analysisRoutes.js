const express = require('express');
const router = express.Router();
const {
  uploadAndAnalyzeFasta,
  getAnalysisHistory,
  getAnalysisDetails
} = require('../controllers/analysisController');

// Route: Upload and run analysis
router.post('/upload', uploadAndAnalyzeFasta);

// Route: Get summary list of upload history
router.get('/history', getAnalysisHistory);

// Route: Get full analysis results by upload ID
router.get('/:id', getAnalysisDetails);

module.exports = router;
