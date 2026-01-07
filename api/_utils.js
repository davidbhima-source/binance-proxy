import crypto from "crypto";

export const BINANCE_BASE = "https://api.binance.com";

export function requireProxyKey(req, res) {
  const got = req.headers["x-proxy-key"];
  if (!process.env.PROXY_KEY) return true; // si no lo configuras, lo deja abierto
  if (got !== process.env.PROXY_KEY) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }
  return true;
}

export function hmacSha256(payload) {
  return crypto
    .createHmac("sha256", process.env.BINANCE_API_SECRET)
    .update(payload)
    .digest("hex");
}
