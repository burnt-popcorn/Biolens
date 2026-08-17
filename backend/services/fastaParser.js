const fs = require('fs').promises;

/**
 * Parses a FASTA file from path.
 * @param {string} filePath - Path to the FASTA file
 * @returns {Promise<Object>} Parsed FASTA data
 */
async function parseFastaFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return parseFasta(content);
}

/**
 * Parses a FASTA string.
 * @param {string} fastaString - FASTA formatted string
 * @returns {Object} Parsed FASTA data
 */
function parseFasta(fastaString) {
  const lines = fastaString.split(/\r?\n/);
  let header = '';
  const sequenceParts = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.startsWith('>')) {
      // If we have multiple sequences, this simple parser will merge them
      // but we extract the first header as the identifier.
      if (!header) {
        header = line.substring(1).trim();
      }
    } else {
      sequenceParts.push(line);
    }
  }

  const rawSequence = sequenceParts.join('');
  // Clean sequence: make uppercase, remove digits and non-alphabetic chars
  const sequence = rawSequence.toUpperCase().replace(/[^A-Z]/g, '');

  // Calculate statistics
  const counts = { A: 0, T: 0, C: 0, G: 0, U: 0, N: 0, other: 0 };
  
  for (let char of sequence) {
    if (counts.hasOwnProperty(char)) {
      counts[char]++;
    } else {
      counts.other++;
    }
  }

  const length = sequence.length;

  // Determine sequence type (DNA, RNA, or Protein)
  let sequenceType = 'Unknown';
  if (length > 0) {
    const dnaRnaCharsCount = counts.A + counts.T + counts.C + counts.G + counts.U + counts.N;
    const ratio = dnaRnaCharsCount / length;

    if (ratio > 0.85) {
      if (counts.U > counts.T) {
        sequenceType = 'RNA';
      } else {
        sequenceType = 'DNA';
      }
    } else {
      // Protein alphabet: ACDEFGHIKLMNPQRSTVWY
      const proteinAlphabet = 'ACDEFGHIKLMNPQRSTVWY';
      let proteinCharsCount = 0;
      for (let char of sequence) {
        if (proteinAlphabet.includes(char)) {
          proteinCharsCount++;
        }
      }
      const proteinRatio = proteinCharsCount / length;
      if (proteinRatio > 0.8) {
        sequenceType = 'Protein';
      }
    }
  }

  // Calculate GC content (using standard bases A, T, C, G, U)
  const baseCount = counts.A + (sequenceType === 'RNA' ? counts.U : counts.T) + counts.C + counts.G;
  const gcContent = baseCount > 0 ? ((counts.G + counts.C) / baseCount) * 100 : 0;

  return {
    header,
    sequence,
    sequenceType,
    stats: {
      length,
      gcContent: parseFloat(gcContent.toFixed(2)),
      counts,
    }
  };
}

module.exports = {
  parseFastaFile,
  parseFasta
};
