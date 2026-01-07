from binance.client import Client
import pandas as pd
import os
import json

def handler(request, response):
    try:
        client = Client(os.getenv("BINANCE_API_KEY"), os.getenv("BINANCE_API_SECRET"))

        # Obtener velas ETHUSDT 1h del 1 Dic 2025
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

        data = df.to_dict(orient="records")

        response.status_code = 200
        response.headers["Content-Type"] = "application/json"
        response.body = json.dumps(data)
        return response

    except Exception as e:
        response.status_code = 500
        response.body = json.dumps({"error": str(e)})
        return response

