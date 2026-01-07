import * as crypto from "crypto";


info = Client(tld='us').get_historical_klines(symbol, timeframe, starting_date);

export const BINANCE_BASE = "https://api.binance.com";

export function hmacSha256(payload) {
  const secret = process.env.BINANCE_API_SECRET;
  if (!secret) throw new Error("BINANCE_API_SECRET is not set");

  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
