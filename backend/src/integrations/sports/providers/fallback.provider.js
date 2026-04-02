import { fallbackMatches } from '../../../data/fallbackMatches.js';

export class FallbackSportsProvider {
  constructor() {
    this.providerName = 'fallback-local';
    this.isConfigured = true;
  }

  async getMatches() {
    return {
      source: this.providerName,
      limitedMode: true,
      message:
        'Modo limitado: configure SPORTS_API_KEY para obter partidas reais e atualizadas em tempo real.',
      matches: fallbackMatches.map((match) => ({
        ...match,
        lastUpdated: new Date().toISOString()
      }))
    };
  }

  async getAnalysisContext(match) {
    return {
      contextSource: this.providerName,
      limited: true,
      reason: 'Sem dados externos. Contexto gerado localmente.',
      homeStats: {
        form: match?.stats?.home?.form || [],
        goalsScored: match?.stats?.home?.goalsScored || 0,
        goalsConceded: match?.stats?.home?.goalsConceded || 0
      },
      awayStats: {
        form: match?.stats?.away?.form || [],
        goalsScored: match?.stats?.away?.goalsScored || 0,
        goalsConceded: match?.stats?.away?.goalsConceded || 0
      },
      homeRecent: {
        form: match?.stats?.home?.form || [],
        avgScored: match?.stats?.home?.goalsScored || 0,
        avgConceded: match?.stats?.home?.goalsConceded || 0
      },
      awayRecent: {
        form: match?.stats?.away?.form || [],
        avgScored: match?.stats?.away?.goalsScored || 0,
        avgConceded: match?.stats?.away?.goalsConceded || 0
      },
      h2hSummary: match?.stats?.h2h || 'Sem historico detalhado.'
    };
  }
}
