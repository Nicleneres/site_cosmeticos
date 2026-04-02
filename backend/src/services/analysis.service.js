import { AppError } from '../lib/errors.js';
import { fetchAnalysisContext } from '../integrations/sports/sportsClient.js';
import { generateTextWithGemini, isGeminiConfigured } from '../integrations/ai/gemini.client.js';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (valid.length === 0) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function toPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function poissonZero(lambda) {
  return Math.exp(-Math.max(lambda, 0));
}

function normalizeBaseStats(match, context) {
  const homeFallback = match?.stats?.home || {};
  const awayFallback = match?.stats?.away || {};

  const homeAvgScored = average([
    safeNumber(context?.homeRecent?.avgScored, NaN),
    safeNumber(homeFallback.goalsScored, NaN)
  ]);
  const homeAvgConceded = average([
    safeNumber(context?.homeRecent?.avgConceded, NaN),
    safeNumber(homeFallback.goalsConceded, NaN)
  ]);
  const awayAvgScored = average([
    safeNumber(context?.awayRecent?.avgScored, NaN),
    safeNumber(awayFallback.goalsScored, NaN)
  ]);
  const awayAvgConceded = average([
    safeNumber(context?.awayRecent?.avgConceded, NaN),
    safeNumber(awayFallback.goalsConceded, NaN)
  ]);

  const homeForm = context?.homeRecent?.form?.length
    ? context.homeRecent.form
    : context?.homeStats?.form?.length
      ? context.homeStats.form
      : homeFallback.form || [];

  const awayForm = context?.awayRecent?.form?.length
    ? context.awayRecent.form
    : context?.awayStats?.form?.length
      ? context.awayStats.form
      : awayFallback.form || [];

  return {
    homeAvgScored: clamp(homeAvgScored || 1.2, 0.2, 4.0),
    homeAvgConceded: clamp(homeAvgConceded || 1.1, 0.2, 4.0),
    awayAvgScored: clamp(awayAvgScored || 1.1, 0.2, 4.0),
    awayAvgConceded: clamp(awayAvgConceded || 1.2, 0.2, 4.0),
    homeForm,
    awayForm
  };
}

function formMomentum(formArray) {
  const weights = { W: 1, D: 0, L: -1 };
  const normalized = Array.isArray(formArray) ? formArray : [];
  if (normalized.length === 0) return 0;
  return normalized.reduce((sum, item) => sum + (weights[item] ?? 0), 0) / normalized.length;
}

function buildStatisticalModel(match, context) {
  const stats = normalizeBaseStats(match, context);
  const homeMomentum = formMomentum(stats.homeForm);
  const awayMomentum = formMomentum(stats.awayForm);

  const lambdaHome = clamp(
    ((stats.homeAvgScored + stats.awayAvgConceded) / 2) * (1 + homeMomentum * 0.08) + 0.15,
    0.2,
    3.5
  );
  const lambdaAway = clamp(
    ((stats.awayAvgScored + stats.homeAvgConceded) / 2) * (1 + awayMomentum * 0.08),
    0.2,
    3.5
  );

  const totalLambda = lambdaHome + lambdaAway;
  const pOver25 = clamp(1 - poissonZero(totalLambda) * (1 + totalLambda + (totalLambda ** 2) / 2), 0, 1);
  const pBtts = clamp((1 - poissonZero(lambdaHome)) * (1 - poissonZero(lambdaAway)), 0, 1);

  const edge = lambdaHome - lambdaAway;
  const homeWin = clamp(0.45 + edge * 0.18, 0.1, 0.8);
  const awayWin = clamp(0.35 - edge * 0.15, 0.1, 0.75);
  const draw = clamp(1 - homeWin - awayWin, 0.1, 0.5);

  const probableScore = `${Math.round(lambdaHome)}-${Math.round(lambdaAway)}`;
  const dataQuality =
    (context?.limited ? 0.42 : 0.7) +
    (stats.homeForm.length >= 3 ? 0.1 : 0) +
    (stats.awayForm.length >= 3 ? 0.1 : 0);
  const confidenceScore = clamp(0.35 + dataQuality * 0.45 + Math.min(Math.abs(edge), 0.8) * 0.2, 0.3, 0.9);

  const confidenceLabel =
    confidenceScore >= 0.75 ? 'alto' : confidenceScore >= 0.6 ? 'medio' : 'moderado-baixo';

  return {
    stats,
    lambdaHome,
    lambdaAway,
    pOver25,
    pBtts,
    homeWin,
    draw,
    awayWin,
    probableScore,
    confidenceScore,
    confidenceLabel
  };
}

function choose1x2Recommendation(model, match) {
  const max = Math.max(model.homeWin, model.draw, model.awayWin);
  if (max === model.homeWin) return `Tendencia principal: ${match.home} (1) com protecao em empate.`;
  if (max === model.awayWin) return `Tendencia principal: ${match.away} (2) com protecao em empate.`;
  return 'Tendencia principal: empate (X) em jogo de equilibrio alto.';
}

function buildStatisticalFallbackReport(match, context, model) {
  const kickoff = new Date(match.startTime).toLocaleString('pt-BR');
  const statusLine = match.status || 'SCHEDULED';
  const h2h = context?.h2hSummary || match?.stats?.h2h || 'Sem historico suficiente.';

  const pointsOfAttention = [
    context?.limited ? '- Dados externos incompletos para esta fixture.' : '- Dados externos carregados.',
    match?.odds?.[1] && match?.odds?.X && match?.odds?.[2]
      ? `- Mercado 1X2 observado: 1=${match.odds[1]}, X=${match.odds.X}, 2=${match.odds[2]}.`
      : '- Odds indisponiveis ou incompletas no feed atual.',
    statusLine === 'LIVE'
      ? '- Partida em andamento: cenarios podem mudar rapidamente.'
      : '- Partida pre-jogo: sem eventos in-play considerados.'
  ];

  const markets = [
    `- 1X2: casa ${toPercent(model.homeWin)}, empate ${toPercent(model.draw)}, fora ${toPercent(model.awayWin)}.`,
    `- Over 2.5: ${toPercent(model.pOver25)}.`,
    `- BTTS (ambas marcam): ${toPercent(model.pBtts)}.`,
    choose1x2Recommendation(model, match)
  ];

  return [
    `Resumo da partida: ${match.home} vs ${match.away} (${match.league}, ${match.country || 'N/A'}), inicio ${kickoff}, status ${statusLine}.`,
    `Leitura estatistica: ataque/defesa recente aponta xG aproximado de ${model.lambdaHome.toFixed(2)} x ${model.lambdaAway.toFixed(2)}. H2H: ${h2h}`,
    `Pontos de atencao:\n${pointsOfAttention.join('\n')}`,
    `Cenario mais provavel: placar de referencia ${model.probableScore}, com tendencia de total de gols em torno de ${(
      model.lambdaHome + model.lambdaAway
    ).toFixed(2)}.`,
    `Mercados possiveis:\n${markets.join('\n')}`,
    `Nivel de confianca: ${model.confidenceLabel} (${toPercent(model.confidenceScore)}).`,
    'Aviso de responsabilidade: esta leitura e probabilistica e informativa, nao representa garantia de ganho.'
  ].join('\n\n');
}

function buildGeminiPrompt({ match, context, model, fallbackReport }) {
  const contextSummary = {
    fixture: {
      id: match.id,
      league: match.league,
      country: match.country,
      home: match.home,
      away: match.away,
      startTime: match.startTime,
      status: match.status,
      odds: match.odds
    },
    contextSource: context?.contextSource,
    limitedContext: Boolean(context?.limited),
    model: {
      lambdaHome: Number(model.lambdaHome.toFixed(2)),
      lambdaAway: Number(model.lambdaAway.toFixed(2)),
      over25Prob: Number(model.pOver25.toFixed(3)),
      bttsProb: Number(model.pBtts.toFixed(3)),
      homeWinProb: Number(model.homeWin.toFixed(3)),
      drawProb: Number(model.draw.toFixed(3)),
      awayWinProb: Number(model.awayWin.toFixed(3)),
      probableScore: model.probableScore,
      confidenceScore: Number(model.confidenceScore.toFixed(3))
    },
    h2h: context?.h2hSummary || null,
    homeForm: model.stats.homeForm,
    awayForm: model.stats.awayForm
  };

  return `Voce recebera um resumo estatistico de partida e deve produzir uma analise final de aposta em portugues (pt-BR), objetiva e profissional.
Regras obrigatorias:
1) Nao prometer lucro.
2) Declarar incerteza e riscos.
3) Manter exatamente estas secoes, nessa ordem:
   - resumo da partida
   - leitura estatistica
   - pontos de atencao
   - cenario mais provavel
   - mercados possiveis
   - nivel de confianca
   - aviso de responsabilidade
4) Resposta curta, clara e acionavel.

Contexto estruturado:
${JSON.stringify(contextSummary, null, 2)}

Rascunho estatistico local:
${fallbackReport}`;
}

export async function generateAnalysis(match) {
  if (!match || !match.id || !match.home || !match.away) {
    throw new AppError(400, 'Payload invalido: match incompleto para analise.');
  }

  const context = await fetchAnalysisContext(match);
  const model = buildStatisticalModel(match, context);
  const fallbackReport = buildStatisticalFallbackReport(match, context, model);

  if (!isGeminiConfigured()) {
    return {
      source: 'statistical-fallback',
      report: fallbackReport,
      confidence: {
        score: Number(model.confidenceScore.toFixed(3)),
        label: model.confidenceLabel
      },
      generatedAt: new Date().toISOString()
    };
  }

  try {
    const prompt = buildGeminiPrompt({ match, context, model, fallbackReport });
    const aiText = await generateTextWithGemini(prompt);

    const source = context?.limited ? 'external-ai' : 'hybrid';
    return {
      source,
      report: aiText,
      confidence: {
        score: Number(model.confidenceScore.toFixed(3)),
        label: model.confidenceLabel
      },
      generatedAt: new Date().toISOString()
    };
  } catch {
    return {
      source: 'statistical-fallback',
      report: fallbackReport,
      confidence: {
        score: Number(model.confidenceScore.toFixed(3)),
        label: model.confidenceLabel
      },
      generatedAt: new Date().toISOString()
    };
  }
}
