import 'dotenv/config';

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return fallback;
}

function splitCsv(value) {
  return String(value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function sanitizeSecret(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const upper = raw.toUpperCase();
  if (upper.includes('PUT_YOUR') || upper.includes('CHANGE_THIS') || upper.includes('YOUR_')) {
    return '';
  }
  return raw;
}

function validatePort(port) {
  return Number.isInteger(port) && port > 0 && port <= 65535;
}

const warnings = [];
const errors = [];

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 4000),
  corsOrigins: splitCsv(process.env.CORS_ORIGIN),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/visionbet',
  databaseSsl: toBool(process.env.DATABASE_SSL, false),
  jwtSecret: sanitizeSecret(process.env.JWT_SECRET) || 'visionbet-dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: sanitizeSecret(process.env.GEMINI_API_KEY),
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  sportsProvider: process.env.SPORTS_API_PROVIDER || 'api-football',
  sportsApiKey: sanitizeSecret(process.env.SPORTS_API_KEY),
  sportsApiBaseUrl: process.env.SPORTS_API_BASE_URL || 'https://v3.football.api-sports.io',
  sportsApiTimeoutMs: toInt(process.env.SPORTS_API_TIMEOUT_MS, 12000),
  sportsFetchOdds: toBool(process.env.SPORTS_FETCH_ODDS, false),
  sportsLookaheadDays: toInt(process.env.SPORTS_LOOKAHEAD_DAYS, 3),
  sportsTimezone: process.env.SPORTS_TIMEZONE || 'America/Sao_Paulo'
};

if (!validatePort(env.port)) {
  errors.push(`PORT invalida: ${env.port}`);
}

if (!env.databaseUrl) {
  errors.push('DATABASE_URL ausente.');
}

if (!env.jwtSecret || env.jwtSecret.length < 16) {
  warnings.push('JWT_SECRET curto ou ausente. Use um segredo forte em producao.');
}

if (!env.geminiApiKey) {
  warnings.push('GEMINI_API_KEY ausente. Analise IA rodara em modo estatistico local.');
}

if (!env.sportsApiKey) {
  warnings.push(
    'SPORTS_API_KEY ausente. /api/matches rodara em modo limitado com fallback local.'
  );
}

if (errors.length > 0) {
  const error = new Error(`Falha na validacao de ambiente: ${errors.join(' | ')}`);
  error.code = 'ENV_VALIDATION_ERROR';
  throw error;
}

export { env, warnings };
