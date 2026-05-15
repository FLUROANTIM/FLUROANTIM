const { createClient } = require('@libsql/client');
const env = require('../config/env');

const db = createClient({
  url: env.tursoUrl,
  authToken: env.tursoToken,
});

async function getLatestCalibrationReadings(limit = 20) {
  const stmt = `
    SELECT
      id,
      id_substancia,
      ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9,
      ch10, ch11, ch12, ch13, ch14, ch15, ch16, ch17, ch18,
      ph,
      temp,
      densidade_real,
      lote_id,
      coletado_em
    FROM dataset_calibracao
    ORDER BY datetime(coletado_em) DESC
    LIMIT ?
  `;

  const result = await db.execute({ sql: stmt, args: [limit] });
  return result.rows;
}

module.exports = {
  getLatestCalibrationReadings,
};
