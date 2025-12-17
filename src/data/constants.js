// src/data/constants.js

// Use the production API directly by default so searches and imports work
// everywhere. The URL can be overridden with VITE_POKEMON_TCG_API_URL
// (for example "/api/pokemontcg/cards" for a local/Vercel proxy).
export const POKEMON_TCG_API_URL =
  import.meta.env.VITE_POKEMON_TCG_API_URL ||
  "https://api.pokemontcg.io/v2/cards";

export const DEFAULT_API_KEY =
  typeof __pokemon_api_key !== "undefined" && __pokemon_api_key
    ? __pokemon_api_key
    : "7113ac06-a7ab-4216-9030-6b5d2e61dd18";

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
