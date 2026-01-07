export default async function handler(req, res) {
  try {
    const { symbol } = req.query || {};

    const url = new URL("https://api.binance.com/api/v3/ticker/price");
    if (symbol) url.searchParams.set("symbol", String(symbol).toUpperCase());

    const r = await fetch(url);
    const data = await r.json();

    res.setHeader("Cache-Control", "s-maxage=2, stale-while-revalidate=15");
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "proxy_error", detail: String(e) });
  }
}
