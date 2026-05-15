/**
 * Serviço base para inferência TFJS no backend Node.js.
 * Ajuste os caminhos e o esquema de normalização conforme o treinamento real.
 */
const tf = require('@tensorflow/tfjs-node');

let model;

async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel('file://backend/model/model.json');
  }
  return model;
}

function normalizeInput(reading) {
  // TODO: substituir por scaler real salvo do treinamento.
  const spectrum = reading.spectrum18.map((v) => Number(v) / 65535);
  const ph = Number(reading.ph) / 14;
  const temp = (Number(reading.temp) + 20) / 120;
  const densidade = Number(reading.densidade) / 2;
  return [...spectrum, ph, temp, densidade];
}

async function predictTop3(reading, classLabels) {
  const mdl = await loadModel();
  const features = normalizeInput(reading);
  const input = tf.tensor2d([features]);
  const output = mdl.predict(input);
  const probs = Array.from(await output.data());

  input.dispose();
  output.dispose();

  const ranked = probs
    .map((p, i) => ({ label: classLabels[i], prob: p }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 3);

  return ranked;
}

module.exports = {
  predictTop3,
};
