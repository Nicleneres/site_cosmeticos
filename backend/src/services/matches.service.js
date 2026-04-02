import { fetchMatches as fetchMatchesFromProvider } from '../integrations/sports/sportsClient.js';

export async function listMatches({ league, search }) {
  return fetchMatchesFromProvider({ league, search });
}
