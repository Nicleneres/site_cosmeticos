function mapStatus(shortCode, longLabel) {
  const code = String(shortCode || '').toUpperCase();
  if (['NS', 'TBD', 'PST'].includes(code)) return 'SCHEDULED';
  if (['1H', '2H', 'HT', 'ET', 'BT', 'LIVE', 'INT'].includes(code)) return 'LIVE';
  if (['FT', 'AET', 'PEN'].includes(code)) return 'FINISHED';
  if (['CANC', 'ABD', 'SUSP'].includes(code)) return 'CANCELED';
  if (longLabel) return String(longLabel).toUpperCase();
  return 'UNKNOWN';
}

export function normalizeFixtureFromApiFootball(fixture) {
  const startTime = fixture?.fixture?.date || new Date().toISOString();
  const odds = fixture?.odds || null;
  const statusShort = fixture?.fixture?.status?.short || '';
  const statusLong = fixture?.fixture?.status?.long || '';

  return {
    id: String(fixture?.fixture?.id ?? `fixture-${Date.now()}`),
    league: fixture?.league?.name || 'Liga desconhecida',
    country: fixture?.league?.country || 'Desconhecido',
    home: fixture?.teams?.home?.name || 'Casa',
    away: fixture?.teams?.away?.name || 'Fora',
    startTime,
    time: new Date(startTime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    status: mapStatus(statusShort, statusLong),
    odds:
      odds && typeof odds === 'object' && odds['1'] && odds['X'] && odds['2']
        ? odds
        : { 1: null, X: null, 2: null },
    source: 'api-football',
    lastUpdated: new Date().toISOString(),
    stats: {
      home: { goalsScored: 0, goalsConceded: 0, xG: 0, form: [] },
      away: { goalsScored: 0, goalsConceded: 0, xG: 0, form: [] },
      h2h: 'Sem dados detalhados no feed base.'
    },
    meta: {
      provider: 'api-football',
      fixtureId: fixture?.fixture?.id ?? null,
      leagueId: fixture?.league?.id ?? null,
      season: fixture?.league?.season ?? null,
      homeTeamId: fixture?.teams?.home?.id ?? null,
      awayTeamId: fixture?.teams?.away?.id ?? null,
      statusShort
    }
  };
}

export function normalizeFixtures(fixtures = []) {
  return fixtures.map((fixture) => normalizeFixtureFromApiFootball(fixture));
}

export function filterAndSearchMatches(matches, { league = 'Todas', search = '' } = {}) {
  const normalizedSearch = String(search || '')
    .trim()
    .toLowerCase();

  return matches.filter((match) => {
    const matchesLeague = league === 'Todas' || match.league === league;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      match.home.toLowerCase().includes(normalizedSearch) ||
      match.away.toLowerCase().includes(normalizedSearch) ||
      match.league.toLowerCase().includes(normalizedSearch);
    return matchesLeague && matchesSearch;
  });
}
