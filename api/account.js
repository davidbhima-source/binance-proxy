import { BINANCE_BASE, requireProxyKey, hmacSha256 } from "_utils.js";

export default async function handler(req, res) {
  try {
    if (!requireProxyKey(req, res)) return;

    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
      return res.status(500).json({ error: "missing_env_vars" });
    }

    const timestamp = Date.now();
    const params = new URLSearchParams({
      timestamp: String(timestamp),
      recvWindow: "5000"
    });

    const signature = hmacSha256(params.toString()); // GET: payload = query string :contentReference[oaicite:4]{index=4}
    params.set("signature", signature);

    const url = `${BINANCE_BASE}/api/account?${params.toString()}`;
    const r = await fetch(url, {
      headers: { "X-MBX-APIKEY": process.env.BINANCE_API_KEY }
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "proxy_error", detail: String(e) });
  }
}
