/**
 * Enrich the DNA analysis with real data from Ensembl REST API.
 * @param {string} ensemblId - Ensembl Gene Identifier (e.g. ENSG00000244737)
 * @param {string} geneName - Gene name symbol (e.g. HBB)
 * @param {string} species - Species name (e.g. Homo sapiens)
 * @returns {Promise<Object>} Enriched details with description, location, links
 */
async function enrichWithEnsemblData(ensemblId, geneName, species = 'Homo sapiens') {
  const result = {
    description: null,
    location: null,
    ensemblId: ensemblId,
    externalLinks: []
  };

  if (!ensemblId && !geneName) return result;

  const speciesSlug = species.toLowerCase().replace(/ /g, '_');
  
  let url = '';
  if (ensemblId) {
    url = `https://rest.ensembl.org/lookup/id/${ensemblId}?content-type=application/json`;
  } else if (geneName && speciesSlug !== 'unknown') {
    url = `https://rest.ensembl.org/lookup/symbol/${speciesSlug}/${geneName}?content-type=application/json`;
  } else {
    return result;
  }

  try {
    // Node.js 18+ provides global fetch. We add a timeout controller to prevent hanging.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      result.description = data.description || `Gene encoding ${data.display_name || geneName}`;
      result.location = `${data.seq_region_name}:${data.start}-${data.end} (strand: ${data.strand > 0 ? '+' : '-'})`;
      result.ensemblId = data.id || ensemblId;
      
      // Clean up description format from Ensembl (e.g. "hemoglobin subunit beta [Source:HGNC Symbol;Acc:HGNC:4827]")
      if (result.description && result.description.includes(' [Source:')) {
        result.description = result.description.split(' [Source:')[0];
      }

      const speciesNamePath = data.species || speciesSlug;
      result.externalLinks.push({
        name: "Ensembl Gene Summary",
        url: `https://www.ensembl.org/${speciesNamePath.charAt(0).toUpperCase() + speciesNamePath.slice(1)}/Gene/Summary?g=${result.ensemblId}`
      });
    } else {
      throw new Error(`Ensembl REST API returned status ${response.status}`);
    }
  } catch (error) {
    console.warn(`[Ensembl Service] Query failed: ${error.message}. Using fallback curated data.`);
    
    // Provide realistic curated fallback metadata if offline
    if (geneName === 'HBB') {
      result.description = "Hemoglobin subunit beta. Provides instructions for making a protein called beta-globin, which is a component of hemoglobin.";
      result.location = "11:5225464-5229395 (strand: -)";
    } else if (geneName === 'CFTR') {
      result.description = "Cystic Fibrosis Transmembrane Conductance Regulator. Functions as a chloride channel, regulating fluid and salt balance in tissues.";
      result.location = "7:117465784-117668665 (strand: +)";
    } else if (geneName === 'HTT') {
      result.description = "Huntingtin. Essential for cellular development, specifically key for neurons in the brain.";
      result.location = "4:3074681-3243960 (strand: +)";
    } else if (geneName === 'DMD') {
      result.description = "Dystrophin. Links muscle cell skeleton to the surrounding tissue; essential for structural integrity of muscle fibers.";
      result.location = "X:28131017-30230248 (strand: +)";
    }
  }

  // Ensure an Ensembl external link exists if we have an ID
  if (result.ensemblId && result.externalLinks.length === 0) {
    result.externalLinks.push({
      name: "Ensembl Gene Summary",
      url: `https://www.ensembl.org/Gene/Summary?g=${result.ensemblId}`
    });
  }

  return result;
}

module.exports = {
  enrichWithEnsemblData
};
