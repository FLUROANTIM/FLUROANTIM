function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name, fallback) {
  return process.env[name] || fallback;
}

module.exports = {
  port: Number(optional('PORT', 3333)),
  openRouterApiKey: required('OPENROUTER_API_KEY'),
  openRouterModel: optional('OPENROUTER_MODEL', 'google/gemini-2.5-pro'),
  openRouterBaseUrl: optional('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
  appUrl: optional('OPENROUTER_APP_URL', 'https://fluro-brain.local'),
  appName: optional('OPENROUTER_APP_NAME', 'FLUROANTIM'),
  tursoUrl: required('TURSO_DATABASE_URL'),
  tursoToken: required('TURSO_AUTH_TOKEN'),
};
