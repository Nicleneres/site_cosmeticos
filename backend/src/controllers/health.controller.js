import { env } from '../config/env.js';

export function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'visionbet-pro-backend',
    dbReady: Boolean(req.app.locals.dbReady),
    sports: {
      provider: env.sportsProvider,
      configured: Boolean(env.sportsApiKey)
    },
    ai: {
      provider: 'gemini',
      configured: Boolean(env.geminiApiKey),
      model: env.geminiModel
    },
    timestamp: new Date().toISOString()
  });
}
