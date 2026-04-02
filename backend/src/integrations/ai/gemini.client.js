import { env } from '../../config/env.js';
import { AppError } from '../../lib/errors.js';

const MAX_RETRIES = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isGeminiConfigured() {
  return Boolean(env.geminiApiKey);
}

export async function generateTextWithGemini(prompt, retryCount = 0) {
  if (!isGeminiConfigured()) {
    throw new AppError(503, 'GEMINI_API_KEY nao configurada.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [
          {
            text:
              'Voce e um analista quantitativo de futebol. Produza uma analise objetiva, sem prometer ganhos, com linguagem de risco e probabilidade.'
          }
        ]
      }
    })
  });

  if (!response.ok) {
    if ((response.status === 429 || response.status >= 500) && retryCount < MAX_RETRIES) {
      await sleep(Math.pow(2, retryCount) * 1000);
      return generateTextWithGemini(prompt, retryCount + 1);
    }
    throw new AppError(502, `Falha na API Gemini (${response.status}).`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text)
    .filter(Boolean)
    .join('\n')
    .trim();

  if (!text) {
    throw new AppError(502, 'Gemini retornou resposta vazia.');
  }

  return text;
}
