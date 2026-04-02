import { env } from '../../../config/env.js';
import { AppError } from '../../../lib/errors.js';
import { logger } from '../../../lib/logger.js';
import { normalizeFixtures } from '../normalizer.js';

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function parseMatchWinnerOdds(oddsPayload) {
  const response = Array.isArray(oddsPayload?.response) ? oddsPayload.response : [];
  const first = response[0];
  const bookmakers = Array.isArray(first?.bookmakers) ? first.bookmakers : [];
  const bets = bookmakers.flatMap((bookmaker) => bookmaker?.bets || []);
  const targetBet = bets.find((bet) => String(bet?.name || '').toLowerCase().includes('match winner'));
  const values = Array.isArray(targetBet?.values) ? targetBet.values : [];

  const mapped = { 1: null, X: null, 2: null };
  for (const value of values) {
    const label = String(value?.value || '').toLowerCase();
    const oddValue = Number.parseFloat(value?.odd);
    if (!Number.isFinite(oddValue)) continue;
    if (label === 'home') mapped[1] = oddValue;
    if (label === 'draw') mapped.X = oddValue;
    if (label === 'away') mapped[2] = oddValue;
  }
  return mapped;
}

function parseFormString(formString) {
  if (!formString) return [];
  return String(formString)
    .replace(/[^WDL]/gi, '')
    .toUpperCase()
    .split('')
    .slice(-5);
}

function extractTeamStats(statsPayload) {
  const data = statsPayload?.response || {};
  return {
    form: parseFormString(data?.form),
    goalsScored:
      Number(data?.goals?.for?.total?.total) ||
      Number(data?.goals?.for?.average?.total) ||
      Number(data?.goals?.for?.average?.home) ||
      0,
    goalsConceded:
      Number(data?.goals?.against?.total?.total) ||
      Number(data?.goals?.against?.average?.total) ||
      Number(data?.goals?.against?.average?.away) ||
      0
  };
}

function summarizeRecentFixtures(payload, teamId) {
  const fixtures = Array.isArray(payload?.response) ? payload.response : [];
  const recent = fixtures.slice(0, 5);
  let goalsScored = 0;
  let goalsConceded = 0;
  const form = [];

  for (const fixture of recent) {
    const isHome = fixture?.teams?.home?.id === teamId;
    const scored = Number(isHome ? fixture?.goals?.home : fixture?.goals?.away);
    const conceded = Number(isHome ? fixture?.goals?.away : fixture?.goals?.home);
    if (Number.isFinite(scored)) goalsScored += scored;
    if (Number.isFinite(conceded)) goalsConceded += conceded;
    if (Number.isFinite(scored) && Number.isFinite(conceded)) {
      if (scored > conceded) form.push('W');
      if (scored === conceded) form.push('D');
      if (scored < conceded) form.push('L');
    }
  }

  const games = Math.max(recent.length, 1);
  return {
    form: form.slice(-5),
    avgScored: Number((goalsScored / games).toFixed(2)),
    avgConceded: Number((goalsConceded / games).toFixed(2))
  };
}

function summarizeH2H(payload, homeTeamId) {
  const fixtures = Array.isArray(payload?.response) ? payload.response : [];
  if (fixtures.length === 0) return 'Sem historico recente de confronto direto.';

  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;

  for (const fixture of fixtures) {
    const homeId = fixture?.teams?.home?.id;
    const homeGoals = Number(fixture?.goals?.home);
    const awayGoals = Number(fixture?.goals?.away);
    if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) continue;

    const isReferenceHome = homeId === homeTeamId;
    const referenceGoals = isReferenceHome ? homeGoals : awayGoals;
    const opponentGoals = isReferenceHome ? awayGoals : homeGoals;

    if (referenceGoals > opponentGoals) homeWins += 1;
    if (referenceGoals < opponentGoals) awayWins += 1;
    if (referenceGoals === opponentGoals) draws += 1;
  }

  return `Ultimos ${fixtures.length}: ${homeWins}V, ${draws}E, ${awayWins}D`;
}

export class ApiFootballProvider {
  constructor() {
    this.providerName = 'api-football';
    this.isConfigured = Boolean(env.sportsApiKey);
  }

  async request(endpoint, params = {}) {
    if (!this.isConfigured) {
      throw new AppError(503, 'SPORTS_API_KEY ausente para API-Football.');
    }

    const url = new URL(`${env.sportsApiBaseUrl}${endpoint}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.sportsApiTimeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'x-apisports-key': env.sportsApiKey
        }
      });

      if (!response.ok) {
        const body = await response.text();
        throw new AppError(502, `Erro na API esportiva (${response.status}).`, {
          endpoint,
          body
        });
      }

      const payload = await response.json();
      return payload;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new AppError(504, 'Timeout na API esportiva.', { endpoint });
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async getMatches() {
    const now = new Date();
    const from = formatDate(now);
    const to = formatDate(new Date(now.getTime() + env.sportsLookaheadDays * 24 * 60 * 60 * 1000));

    const payload = await this.request('/fixtures', {
      from,
      to,
      timezone: env.sportsTimezone
    });

    const fixtures = Array.isArray(payload?.response) ? payload.response : [];
    const normalized = normalizeFixtures(fixtures);

    if (!env.sportsFetchOdds) {
      return {
        source: this.providerName,
        limitedMode: false,
        matches: normalized
      };
    }

    const maxOddsRequests = 8;
    const withOdds = await Promise.all(
      normalized.map(async (match, index) => {
        if (index >= maxOddsRequests) return match;
        try {
          const oddsPayload = await this.request('/odds', { fixture: match.id });
          const parsedOdds = parseMatchWinnerOdds(oddsPayload);
          return {
            ...match,
            odds: parsedOdds
          };
        } catch {
          return match;
        }
      })
    );

    return {
      source: this.providerName,
      limitedMode: false,
      matches: withOdds
    };
  }

  async getAnalysisContext(match) {
    const meta = match?.meta || {};
    const leagueId = meta.leagueId;
    const season = meta.season;
    const homeTeamId = meta.homeTeamId;
    const awayTeamId = meta.awayTeamId;

    if (!leagueId || !season || !homeTeamId || !awayTeamId) {
      return {
        contextSource: this.providerName,
        limited: true,
        reason: 'Metadados insuficientes para buscar contexto adicional.'
      };
    }

    const [homeStatsPayload, awayStatsPayload, homeRecentPayload, awayRecentPayload, h2hPayload] =
      await Promise.all([
        this.request('/teams/statistics', { league: leagueId, season, team: homeTeamId }).catch(
          () => null
        ),
        this.request('/teams/statistics', { league: leagueId, season, team: awayTeamId }).catch(
          () => null
        ),
        this.request('/fixtures', { team: homeTeamId, last: 5, timezone: env.sportsTimezone }).catch(
          () => null
        ),
        this.request('/fixtures', { team: awayTeamId, last: 5, timezone: env.sportsTimezone }).catch(
          () => null
        ),
        this.request('/fixtures/headtohead', { h2h: `${homeTeamId}-${awayTeamId}`, last: 5 }).catch(
          () => null
        )
      ]);

    const homeStats = extractTeamStats(homeStatsPayload || {});
    const awayStats = extractTeamStats(awayStatsPayload || {});
    const homeRecent = summarizeRecentFixtures(homeRecentPayload || {}, homeTeamId);
    const awayRecent = summarizeRecentFixtures(awayRecentPayload || {}, awayTeamId);
    const h2hSummary = summarizeH2H(h2hPayload || {}, homeTeamId);

    logger.info('Contexto de analise carregado com API-Football.', {
      fixtureId: match.id
    });

    return {
      contextSource: this.providerName,
      limited: false,
      homeStats,
      awayStats,
      homeRecent,
      awayRecent,
      h2hSummary
    };
  }
}
