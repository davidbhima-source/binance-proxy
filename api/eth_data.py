from binance.client import Client
import pandas as pd
import os
import json

def handler(event, context):
    try:
        # 🔒 Cargar credenciales
        client = Client(os.getenv("BINANCE_API_KEY"), os.getenv("BINANCE_API_SECRET"))

        # 📅 Parámetros fijos (puedes cambiarlos luego)
        klines = client.get_historical_klines(
            "ETHUSDT",
            Client.KLINE_INTERVAL_1HOUR,
            "2025-12-01 00:00:00",
            "2025-12-02 00:00:00"
        )

        # 🧾 Procesar datos
        df = pd.DataFrame(klines, columns=[
            "open_time","open","high","low","close","volume",
            "close_time","quote_asset_volume","num_trades",
            "taker_buy_base","taker_buy_quote","ignore"
        ])
        df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
        df = df[["open_time","open","high","low","close","volume"]]

        # 🔁 Convertir a JSON
        data = df.to_dict(orient="records")

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(data)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
