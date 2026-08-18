const path = require('path');
const fs = require('fs');
const { parseFastaFile } = require('../services/fastaParser');
const { analyzeSequence } = require('../services/blastService');
const { enrichWithEnsemblData } = require('../services/diseaseService');

// Test files map
const TEST_FILES = {
  hbb_normal: path.join(__dirname, '../test_data/hbb_normal.fasta'),
  hbb_sickle: path.join(__dirname, '../test_data/hbb_sickle.fasta'),
  cftr_deltaf508: path.join(__dirname, '../test_data/cftr_deltaf508.fasta'),
  huntington: path.join(__dirname, '../test_data/huntington_cag_expansion.fasta'),
  sars_cov_2: path.join(__dirname, '../test_data/sars_cov_2.fasta'),
  actn3_sprint: path.join(__dirname, '../test_data/actn3_sprint.fasta')
};

async function runTest(testName, filePath) {
  console.log(`\n========================================`);
  console.log(`RUNNING TEST: ${testName.toUpperCase()}`);
  console.log(`File: ${path.basename(filePath)}`);
  console.log(`========================================`);

  if (!fs.existsSync(filePath)) {
    console.error(`[Error] Test file not found: ${filePath}`);
    return false;
  }

  try {
    // 1. Test parsing
    console.log('1. Parsing FASTA file...');
    const parsed = await parseFastaFile(filePath);
    console.log(`   - Header: ${parsed.header}`);
    console.log(`   - Sequence Length: ${parsed.stats.length}`);
    console.log(`   - GC Content: ${parsed.stats.gcContent}%`);
    console.log(`   - Sequence Type: ${parsed.sequenceType}`);
    console.log(`   - Nucleotide Distribution:`, parsed.stats.counts);

    // 2. Test alignment & matching
    console.log('2. Running local alignment & database marker scan...');
    const matched = analyzeSequence(parsed.sequence, parsed.header);
    console.log(`   - Species Identified: ${matched.species}`);
    console.log(`   - Confidence: ${matched.confidence}%`);
    console.log(`   - Gene Matched: ${matched.geneMatched}`);
    console.log(`   - Ensembl ID: ${matched.ensemblId}`);
    console.log(`   - Disease Risks Detected:`, JSON.stringify(matched.diseaseRisks, null, 2));
    console.log(`   - Traits Detected:`, JSON.stringify(matched.traits, null, 2));

    // 3. Test API Enrichment (Ensembl API)
    console.log('3. Fetching annotations and external links from Ensembl REST API...');
    const enriched = await enrichWithEnsemblData(matched.ensemblId, matched.geneMatched, matched.species);
    console.log(`   - Gene Description: ${enriched.description}`);
    console.log(`   - Genomic Coordinates: ${enriched.location}`);
    console.log(`   - External Database Links:`, enriched.externalLinks);

    console.log(`\n[SUCCESS] Test completed for ${testName}.`);
    return true;
  } catch (error) {
    console.error(`\n[FAILED] Test failed for ${testName}:`, error);
    return false;
  }
}

async function main() {
  console.log('=== STARTING BIOLENS BIOINFORMATICS PIPELINE TESTS ===');
  
  let passedCount = 0;
  const tests = Object.keys(TEST_FILES);

  for (const testName of tests) {
    const success = await runTest(testName, TEST_FILES[testName]);
    if (success) passedCount++;
  }

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passedCount}/${tests.length} tests passed.`);
  console.log(`========================================`);
  
  if (passedCount === tests.length) {
    console.log('All tests passed successfully! The bioinformatics engine is fully operational.');
    process.exit(0);
  } else {
    console.error('Some tests failed. Check output for details.');
    process.exit(1);
  }
}

// Execute tests
main();
