const express = require('express');
const networksRouter = require('./routes/networks');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(networksRouter);

app.get('/health', (_, res) => {
  res.json({ ok: true });
});

module.exports = app;
