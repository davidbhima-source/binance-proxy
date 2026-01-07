export default async function handler(req, res) {
  try {
    const r = await fetch("https://api.binance.com/api/v3/time");
    const data = await r.json();

    res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate=30");
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "proxy_error", detail: String(e) });
  }
}
