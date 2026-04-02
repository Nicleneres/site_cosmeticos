import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';

function isLocalOrigin(origin) {
  return /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) || /^http:\/\/localhost:\d+$/.test(origin);
}

function buildCorsOptions() {
  const allowed = env.corsOrigins;
  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowed.length > 0 && allowed.includes(origin)) {
        return callback(null, true);
      }
      if (allowed.length === 0 && isLocalOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS: origin nao permitida.'));
    }
  };
}

export function createApp() {
  const app = express();

  app.use(cors(buildCorsOptions()));
  app.use(express.json({ limit: '1mb' }));

  app.locals.dbReady = false;

  app.use('/api', routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
