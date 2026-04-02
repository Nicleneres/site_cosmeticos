import { generateAnalysis } from '../services/analysis.service.js';

export async function postAnalysis(req, res, next) {
  try {
    const match = req.body?.match;
    const result = await generateAnalysis(match);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
