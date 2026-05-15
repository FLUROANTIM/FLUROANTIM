const OpenAI = require('openai');
const env = require('../config/env');
const fs = require('node:fs');
const path = require('node:path');

const systemPrompt = fs.readFileSync(
  path.resolve(__dirname, '../../../prompts/fluro_brain_system_prompt.md'),
  'utf-8',
);

const client = new OpenAI({
  apiKey: env.openRouterApiKey,
  baseURL: env.openRouterBaseUrl,
  defaultHeaders: {
    'HTTP-Referer': env.appUrl,
    'X-Title': env.appName,
  },
});

async function generateChemicalReport({ reading, top3, contextRows }) {
  const userPayload = {
    leitura: {
      espectro18: reading.spectrum18,
      ph: reading.ph,
      temperatura_c: reading.temp,
      densidade_estimada: reading.densidade,
    },
    top3_predicoes_keras: top3,
    historico_calibracao_recente: contextRows,
  };

  const response = await client.chat.completions.create({
    model: env.openRouterModel,
    temperature: 0.1,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content:
          'Analise a leitura abaixo com rigor físico-químico e gere o laudo no formato definido no system prompt:\n\n' +
          JSON.stringify(userPayload, null, 2),
      },
    ],
  });

  return response.choices?.[0]?.message?.content || 'Sem conteúdo retornado pelo modelo.';
}

module.exports = {
  generateChemicalReport,
};
