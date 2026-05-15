# Plano de Ação — Fluro-Brain como Motor de Dedução Analítica

## Visão geral
Este plano divide o projeto em 2 trilhas:
1. **Inteligência LLM (prompt + laudo técnico)**
2. **Infra de dados/modelo (sensor -> dataset -> ML -> backend -> app)**

---

## Fase 1 — Calibração e dataset (Semanas 1–2)

### Objetivo
Construir base supervisionada com dados reais do seu hardware (AS7265x + variáveis físicas).

### Entregáveis
- Firmware ESP32 de amostragem repetitiva.
- Tabela `dataset_calibracao` no Turso.
- Coleta mínima de 5 a 10 substâncias com ~50 amostras por substância.

### Substâncias sugeridas (seguras e estáveis)
- Água destilada
- Álcool isopropílico
- Acetona
- Glicerina
- Etanol

### SQL inicial
Arquivo: `sql/001_create_dataset_calibracao.sql`

### Critérios de qualidade
- Registrar timestamp e id do lote.
- Garantir repetibilidade (desvio padrão por canal).
- Anotar temperatura em todas as leituras.

---

## Fase 2 — Treinamento do classificador (Semana 3)

### Objetivo
Treinar rede neural multiclasse com dados tabulares multissensores.

### Entregáveis
- Notebook Colab (`notebooks/fluro_brain_training.ipynb` ou `.py` equivalente).
- Pipeline de normalização + split estratificado.
- Modelo com saída softmax e acurácia alvo >90% (com validação).
- Export do modelo para **TensorFlow.js**.

### Boas práticas
- Normalização Min-Max para espectro e parâmetros físicos.
- `EarlyStopping` + `Dropout` para reduzir overfitting.
- Matriz de confusão por substância.

---

## Fase 3 — Integração no backend Node.js (Semana 4)

### Objetivo
Converter leitura bruta em inferência local confiável.

### Entregáveis
- Serviço de inferência em `backend/src/services/modelInferenceService.js`.
- Rota POST `/networks` recebendo payload do ESP32.
- Controlador químico com filtro físico-químico.

### Fluxo
1. ESP32 envia leitura.
2. Backend normaliza dados conforme treino.
3. Modelo TFJS gera top-3 probabilidades.
4. Regras físicas validam consistência.
5. Resultado estruturado segue para etapa LLM.

---

## Fase 4 — Casamento com OpenRouter/LLM (Semana 5)

### Objetivo
Unir classificação matemática + explicação técnico-operacional.

### Entregáveis
- Template do system prompt em `prompts/fluro_brain_system_prompt.md`.
- Serviço `llmReportService` para montar contexto dinâmico.
- Saída em formato de laudo com alerta de segurança.

### Regra de ouro
LLM explica e contextualiza; **não substitui** o modelo físico-matemático.

---

## Fase 5 — UI/UX React Native (Semana 6)

### Objetivo
Exibir diagnóstico em painel operacional legível em tempo real.

### Entregáveis
- Card de assinatura espectral (radar chart).
- Badge de confiança da IA.
- Sinal visual para `ALERTA DE SEGURANÇA`.

---

## KPIs de sucesso do projeto
- Acurácia global do modelo >= 90% em validação.
- Taxa de anomalia corretamente sinalizada.
- Latência ponta a ponta (sensor -> laudo) abaixo de meta operacional.
- Redução de diagnósticos ambíguos no uso real.
