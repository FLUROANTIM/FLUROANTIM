const { predictTop3 } = require('../services/modelInferenceService');
const { getLatestCalibrationReadings } = require('../services/databaseService');
const { generateChemicalReport } = require('../services/openRouterService');

const CLASS_LABELS = ['agua', 'isopropanol', 'acetona', 'glicerina', 'etanol'];

function applyPhysicalFilter(topPrediction, reading) {
  const { label } = topPrediction;
  const ph = Number(reading.ph);

  if (label === 'isopropanol' && ph < 4) {
    return {
      status: 'Possível Contaminação',
      reason: 'pH incompatível com perfil esperado para isopropanol.',
    };
  }

  return {
    status: 'Normal',
    reason: 'Sem conflito físico-químico relevante nas regras atuais.',
  };
}

async function analyzeReading(req, res) {
  try {
    const reading = req.body;
    const top3 = await predictTop3(reading, CLASS_LABELS);
    const validation = applyPhysicalFilter(top3[0], reading);
    const contextRows = await getLatestCalibrationReadings(20);
    const llmReport = await generateChemicalReport({
      reading,
      top3,
      contextRows,
    });

    res.json({
      ok: true,
      reading,
      top3,
      validation,
      llmReport,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'Falha ao processar leitura química.',
      details: error.message,
    });
  }
}

module.exports = {
  analyzeReading,
};
