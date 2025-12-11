// src/data/utils.js

export const getCustomImage = (text) =>
  `https://placehold.co/240x330/1e293b/cbd5e1?text=${encodeURIComponent(
    text
  )}`;

export const getRealImage = (set, num) =>
  `https://images.pokemontcg.io/${set}/${num}.png`;

export const getRealImageHigh = (set, num) =>
  `https://images.pokemontcg.io/${set}/${num}_hires.png`;
