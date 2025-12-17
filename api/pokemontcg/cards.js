export default async function handler(req, res) {
  try {
    const base = "https://api.pokemontcg.io/v2/cards";
    const qs = new URLSearchParams(req.query).toString();
    const url = qs ? `${base}?${qs}` : base;

    const apiKey =
      process.env.POKEMON_TCG_API_KEY || "7113ac06-a7ab-4216-9030-6b5d2e61dd18";

    const upstream = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
    });

    const text = await upstream.text();

    // Cache successful responses at the edge for quicker repeated searches
    if (upstream.ok) {
      res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    }

    res.status(upstream.status).send(text);
  } catch (e) {
    res.status(500).send(String(e));
  }
}
