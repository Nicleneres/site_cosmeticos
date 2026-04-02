import { createApp } from './app.js';
import { env, warnings } from './config/env.js';
import { ensureSchema } from './db/schema.js';
import { pool } from './db/pool.js';
import { logger } from './lib/logger.js';

const app = createApp();

async function bootstrap() {
  if (warnings.length > 0) {
    warnings.forEach((warning) => logger.warn(warning));
  }

  try {
    await ensureSchema();
    await pool.query('SELECT 1');
    app.locals.dbReady = true;
    logger.info('PostgreSQL conectado e schema validado.');
  } catch (error) {
    app.locals.dbReady = false;
    logger.warn('PostgreSQL indisponivel. Auth/Favorites ficarao indisponiveis.', {
      error: error?.message
    });
  }

  app.listen(env.port, () => {
    logger.info(`VisionBet backend ativo em http://127.0.0.1:${env.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error('Falha fatal ao iniciar backend.', { error: error?.message || String(error) });
  process.exit(1);
});
