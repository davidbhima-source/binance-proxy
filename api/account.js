import { BINANCE_BASE, hmacSha256 } from "./_utils.js";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        error: "missing_env_vars",
        missing: [
          !apiKey ? "BINANCE_API_KEY" : null,
          !apiSecret ? "BINANCE_API_SECRET" : null,
        ].filter(Boolean),
      });
    }

    const params = new URLSearchParams({
      timestamp: String(Date.now()),
      recvWindow: "5000",
    });

    // Firma del query string (SIGNED endpoint) 
    const signature = hmacSha256(params.toString());
    params.set("signature", signature);

    const url = `${BINANCE_BASE}/api/v3/account?${params.toString()}`;

    const r = await fetch(url, {
      headers: { "X-MBX-APIKEY": apiKey }, // Header requerido 
    });

    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // No cachear info privada
    res.setHeader("Cache-Control", "no-store");
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "proxy_error", detail: String(e) });
  }
}
