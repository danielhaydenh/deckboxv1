export default async function handler(req, res) {
  try {
    const base = "https://api.pokemontcg.io/v2/cards";
    const qs = new URLSearchParams(req.query).toString();
    const url = qs ? `${base}?${qs}` : base;

    const apiKey = process.env.POKEMON_TCG_API_KEY;
    if (!apiKey) {
      res.status(500).send("Missing POKEMON_TCG_API_KEY on server");
      return;
    }

    const upstream = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
    });

    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch (e) {
    res.status(500).send(String(e));
  }
}
