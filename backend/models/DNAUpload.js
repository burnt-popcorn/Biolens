const mongoose = require('mongoose');

const DNAUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional if we allow anonymous guest uploads
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  sequenceLength: {
    type: Number,
    default: 0,
  },
  sequenceType: {
    type: String,
    enum: ['DNA', 'RNA', 'Protein', 'Unknown'],
    default: 'Unknown',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  errorMessage: {
    type: String,
  },
});

module.exports = mongoose.model('DNAUpload', DNAUploadSchema);
