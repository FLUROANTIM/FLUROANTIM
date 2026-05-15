# FLUROANTIM — Fluro-Brain no backend (OpenRouter + Turso)

Agora o fluxo da IA foi movido para o backend para evitar erro no frontend e permitir leitura direta do banco.

## O que está implementado
- Endpoint `POST /networks` no backend Express.
- Inferência local com TFJS para gerar top-3 probabilidades.
- Leitura de contexto no Turso (`dataset_calibracao`) para enriquecer análise.
- Chamada do OpenRouter no backend (via SDK `openai` com `baseURL` OpenRouter).
- Retorno de laudo técnico (`llmReport`) já pronto para exibir no app.

## Fluxo final
1. Frontend envia leitura do sensor para `POST /networks`.
2. Backend roda modelo local e gera `top3`.
3. Backend lê amostras recentes no Turso.
4. Backend monta contexto e chama OpenRouter.
5. Backend devolve JSON com `top3`, validação físico-química e `llmReport`.

## Setup
1. Copie `.env.example` para `.env` e preencha credenciais.
2. Instale dependências:
   ```bash
   npm install
   ```
3. Rode:
   ```bash
   npm start
   ```

## Arquivos principais
- `backend/src/server.js`
- `backend/src/app.js`
- `backend/src/routes/networks.js`
- `backend/src/controllers/quimicaController.js`
- `backend/src/services/modelInferenceService.js`
- `backend/src/services/databaseService.js`
- `backend/src/services/openRouterService.js`
- `prompts/fluro_brain_system_prompt.md`

## Exemplo de payload
```json
{
  "spectrum18": [1200, 1190, 1300, 1400, 900, 870, 860, 1500, 1600, 1700, 900, 800, 780, 1200, 1000, 950, 920, 910],
  "ph": 6.8,
  "temp": 27.4,
  "densidade": 0.79
}
```
