// src/data/constants.js

// API routing strategy (simple + reliable):
// - On Vercel deployments, use the serverless proxy (keeps the API key off the client).
// - In other environments (StackBlitz/local), fall back to the public endpoint.
export const POKEMON_TCG_API_URL = (() => {
  const envUrl = import.meta.env.VITE_POKEMON_TCG_API_URL?.trim();
  if (envUrl) {
    // Guard against the common mistake of setting "/api/pokemontcg" without "/cards".
    if (envUrl === "/api/pokemontcg") return "/api/pokemontcg/cards";
    if (envUrl.endsWith("/api/pokemontcg")) return `${envUrl}/cards`;
    return envUrl;
  }

  // Auto default: if hosted on Vercel, prefer the proxy route.
  if (typeof window !== "undefined") {
    const host = window.location?.hostname || "";
    if (host.includes("vercel.app")) return "/api/pokemontcg/cards";
  }

  // Otherwise use the public API directly.
  return "https://api.pokemontcg.io/v2/cards";
})();

// Only used when calling the public API directly (StackBlitz/local fallback).
// When using the Vercel proxy, the API key is read server-side from POKEMON_TCG_API_KEY.
export const DEFAULT_API_KEY =
  import.meta.env.VITE_POKEMON_TCG_API_KEY ||
  (typeof __pokemon_api_key !== "undefined" && __pokemon_api_key
    ? __pokemon_api_key
    : "");
// keep your COLORS / TYPE_SYMBOLS / TYPE_ICONS / globalStyles etc here as before

// Deck formats
export const FORMATS = ['Standard', 'Expanded', 'Unlimited', 'GLC'];

// Type colours for pips and charts
export const COLORS = {
  Grass: '#008f41',
  Fire: '#d83235',
  Water: '#0085c3',
  Lightning: '#fdb511',
  Psychic: '#6d51a2',
  Fighting: '#a65822',
  Darkness: '#1f4f57',
  Metal: '#6a7b80',
  Fairy: '#ed79a8',
  Dragon: '#a19f32',
  Colorless: '#ffffff',
  Trainer: '#3b82f6',
  Energy: '#eab308',
};

// Short type symbols for pips
export const TYPE_SYMBOLS = {
  Grass: 'G',
  Fire: 'R',
  Water: 'W',
  Lightning: 'L',
  Psychic: 'P',
  Fighting: 'F',
  Darkness: 'D',
  Metal: 'M',
  Fairy: 'Fa',
  Dragon: 'DR',
  Colorless: 'C',
  Trainer: 'T',
  Energy: 'E',
};

// Global CSS you inject in <style>{globalStyles}</style>
export const globalStyles = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }

  @keyframes fade-in { 
    from { opacity: 0; } 
    to { opacity: 1; } 
  }
  .animate-fade-in { animation: fade-in 0.3s ease-out; }

  @keyframes slide-in { 
    from { opacity: 0; transform: translateY(-10px); } 
    to { opacity: 1; transform: translateY(0); } 
  }
  .animate-slide-in { animation: slide-in 0.3s ease-out; }

  @keyframes pop-in { 
    0% { opacity: 0; transform: scale(0.9); } 
    100% { opacity: 1; transform: scale(1); } 
  }
  .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
`;
