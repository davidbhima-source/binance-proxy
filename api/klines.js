const ALLOWED_INTERVALS = new Set([
  "1m","3m","5m","15m","30m",
  "1h","2h","4h","6h","8h","12h",
  "1d","3d","1w","1M"
]);

export default async function handler(req, res) {
  try {
    const { symbol, interval, limit } = req.query || {};

    if (!symbol) return res.status(400).json({ error: "symbol is required (e.g., BTCUSDT)" });
    if (!interval || !ALLOWED_INTERVALS.has(interval)) {
      return res.status(400).json({ error: "invalid interval" });
    }

    const lim = limit ? Number(limit) : undefined;
    if (lim !== undefined && (!Number.isFinite(lim) || lim < 1 || lim > 1000)) {
      return res.status(400).json({ error: "limit must be 1..1000" });
    }

    const url = new URL("https://api.binance.com/api/v3/klines");
    url.searchParams.set("symbol", String(symbol).toUpperCase());
    url.searchParams.set("interval", interval);
    if (lim !== undefined) url.searchParams.set("limit", String(lim));

    const r = await fetch(url);
    const data = await r.json();

    res.setHeader("Cache-Control", "s-maxage=2, stale-while-revalidate=15");
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "proxy_error", detail: String(e) });
  }
}
