import { listMatches } from '../services/matches.service.js';

export async function getMatches(req, res, next) {
  try {
    const league = typeof req.query.league === 'string' ? req.query.league : 'Todas';
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const result = await listMatches({ league, search });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
