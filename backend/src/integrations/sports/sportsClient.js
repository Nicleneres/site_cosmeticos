import { env } from '../../config/env.js';
import { logger } from '../../lib/logger.js';
import { AppError } from '../../lib/errors.js';
import { ApiFootballProvider } from './providers/apiFootball.provider.js';
import { FallbackSportsProvider } from './providers/fallback.provider.js';
import { filterAndSearchMatches } from './normalizer.js';

function createPrimaryProvider() {
  if (env.sportsProvider === 'api-football') {
    return new ApiFootballProvider();
  }
  throw new AppError(500, `SPORTS_API_PROVIDER nao suportado: ${env.sportsProvider}`);
}

const primaryProvider = createPrimaryProvider();
const fallbackProvider = new FallbackSportsProvider();

export async function fetchMatches({ league, search } = {}) {
  let providerResponse;
  let usedFallback = false;
  let warning = null;

  try {
    providerResponse = await primaryProvider.getMatches();
  } catch (error) {
    usedFallback = true;
    warning = error?.message || 'Falha na API esportiva externa.';
    logger.warn('Falha no provider esportivo primario. Usando fallback local.', {
      error: warning
    });
    providerResponse = await fallbackProvider.getMatches();
  }

  const filteredMatches = filterAndSearchMatches(providerResponse.matches, { league, search });
  const leagues = ['Todas', ...new Set(providerResponse.matches.map((match) => match.league))];

  return {
    matches: filteredMatches,
    leagues,
    source: providerResponse.source,
    limitedMode: Boolean(providerResponse.limitedMode || usedFallback),
    warning
  };
}

export async function fetchAnalysisContext(match) {
  if (!match || typeof match !== 'object') {
    return fallbackProvider.getAnalysisContext(match);
  }

  if (!primaryProvider.isConfigured) {
    return fallbackProvider.getAnalysisContext(match);
  }

  try {
    return await primaryProvider.getAnalysisContext(match);
  } catch (error) {
    logger.warn('Falha ao buscar contexto externo de analise. Usando contexto local.', {
      fixtureId: match.id,
      error: error?.message || String(error)
    });
    return fallbackProvider.getAnalysisContext(match);
  }
}
