export default async function handler(req, res) {
  try {
    const base = "https://api.pokemontcg.io/v2/cards";
    const qs = new URLSearchParams(req.query).toString();
    const url = qs ? `${base}?${qs}` : base;

    const apiKey =
      process.env.POKEMON_TCG_API_KEY ||
      process.env.POKEMON_TCG_APIKEY ||
      "7113ac06-a7ab-4216-9030-6b5d2e61dd18"; // fallback for testing

    const upstream = await fetch(url, {
      headers: { "X-Api-Key": apiKey }
    });

    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch (e) {
    res.status(500).send(String(e));
  }
}
