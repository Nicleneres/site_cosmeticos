const baseTimestamp = new Date().toISOString();

export const fallbackMatches = [
  {
    id: 'fallback-101',
    league: 'Champions League',
    country: 'Europe',
    home: 'Real Madrid',
    away: 'Manchester City',
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    time: new Date(Date.now() + 3 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    status: 'SCHEDULED',
    odds: { 1: 2.45, X: 3.4, 2: 2.8 },
    source: 'fallback-local',
    lastUpdated: baseTimestamp,
    stats: {
      home: { goalsScored: 2.1, goalsConceded: 0.9, xG: 1.9, form: ['W', 'W', 'D', 'W', 'L'] },
      away: { goalsScored: 2.0, goalsConceded: 1.2, xG: 2.0, form: ['W', 'D', 'W', 'L', 'W'] },
      h2h: 'Fallback local: confronto equilibrado recente.'
    },
    meta: {
      limitedMode: true
    }
  },
  {
    id: 'fallback-102',
    league: 'Premier League',
    country: 'England',
    home: 'Arsenal',
    away: 'Liverpool',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    time: new Date(Date.now() + 6 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    status: 'SCHEDULED',
    odds: { 1: 2.2, X: 3.35, 2: 3.05 },
    source: 'fallback-local',
    lastUpdated: baseTimestamp,
    stats: {
      home: { goalsScored: 1.9, goalsConceded: 0.8, xG: 1.8, form: ['W', 'W', 'W', 'D', 'L'] },
      away: { goalsScored: 2.0, goalsConceded: 1.0, xG: 1.9, form: ['W', 'D', 'W', 'W', 'D'] },
      h2h: 'Fallback local: historico recente de jogos abertos.'
    },
    meta: {
      limitedMode: true
    }
  },
  {
    id: 'fallback-103',
    league: 'Brasileirao Serie A',
    country: 'Brazil',
    home: 'Palmeiras',
    away: 'Flamengo',
    startTime: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(),
    time: new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    status: 'SCHEDULED',
    odds: { 1: 2.4, X: 3.0, 2: 2.95 },
    source: 'fallback-local',
    lastUpdated: baseTimestamp,
    stats: {
      home: { goalsScored: 1.6, goalsConceded: 0.7, xG: 1.7, form: ['W', 'D', 'W', 'W', 'L'] },
      away: { goalsScored: 1.8, goalsConceded: 1.0, xG: 1.8, form: ['W', 'W', 'D', 'W', 'D'] },
      h2h: 'Fallback local: confronto tradicionalmente equilibrado.'
    },
    meta: {
      limitedMode: true
    }
  }
];
