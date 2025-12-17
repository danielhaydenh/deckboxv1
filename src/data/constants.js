// src/data/constants.js
// v3.0: Prefer same-origin proxy to avoid slow CORS preflight.
// Falls back to direct API when proxy is unavailable.

export const POKEMON_TCG_PROXY_URL = "/api/pokemontcg/cards";
export const POKEMON_TCG_DIRECT_URL = "https://api.pokemontcg.io/v2/cards";

export const DEFAULT_API_KEY =
  typeof __pokemon_api_key !== "undefined" && __pokemon_api_key
    ? __pokemon_api_key
    : "7113ac06-a7ab-4216-9030-6b5d2e61dd18";
