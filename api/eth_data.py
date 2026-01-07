from binance.client import Client
import pandas as pd
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler
import json

# 🔒 Cargar claves desde variables de entorno
API_KEY = os.getenv("BINANCE_API_KEY")
API_SECRET = os.getenv("BINANCE_API_SECRET")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        client = Client(API_KEY, API_SECRET)

        # Obtener velas ETHUSDT 1h (1 diciembre 2025)
        klines = client.get_historical_klines(
            "ETHUSDT",
            Client.KLINE_INTERVAL_1HOUR,
            "2025-12-01 00:00:00",
            "2025-12-02 00:00:00"
        )

        df = pd.DataFrame(klines, columns=[
            "open_time","open","high","low","close","volume",
            "close_time","quote_asset_volume","num_trades",
            "taker_buy_base","taker_buy_quote","ignore"
        ])
        df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
        df = df[["open_time","open","high","low","close","volume"]]

        # Exportar a JSON plano (para mí)
        json_data = df.to_dict(orient="records")

        # Opción: exportar CSV en la raíz pública
        df.to_csv("/eth_1h.csv", index=False)

        # Responder JSON
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(json_data).encode())
        return
