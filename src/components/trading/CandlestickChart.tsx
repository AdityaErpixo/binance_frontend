import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface Candle {
  x: number;
  y: [number, number, number, number];
}

interface ChartProps {
  symbol: string;
  interval: string;
}

/**
 * Candlestick chart using Binance kline data. Supports realtime updates via WS.
 * - REST: https://api.binance.com/api/v3/klines
 * - WS: wss://stream.binance.com:9443/ws/{symbol}@kline_{interval}
 */
const CandlestickChart: React.FC<ChartProps> = ({ symbol, interval }) => {
  const [series, setSeries] = useState<Candle[]>([]);

  useEffect(() => {
    let ws: WebSocket;
    const fetchKlines = async () => {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`
      );
      const data = await res.json();
      setSeries(
        data.map((k: any) => ({
          x: k[0],
          y: [Number(k[1]), Number(k[2]), Number(k[3]), Number(k[4])],
        }))
      );
    };
    fetchKlines();

    ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
    );
    ws.onmessage = ev => {
      const d = JSON.parse(ev.data);
      const k = d.k;
      setSeries(s => {
        const next = s.slice();
        next[next.length - 1] = {
          x: k.t,
          y: [Number(k.o), Number(k.h), Number(k.l), Number(k.c)],
        };
        return next;
      });
    };
    return () => ws.close();
  }, [symbol, interval]);

  const options = {
    chart: {
      type: "candlestick" as const,
      height: 350,
      animations: { enabled: false },
    },
    xaxis: { type: "datetime" as const },
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ data: series }]}
      type="candlestick"
      height={350}
    />
  );
};

export default CandlestickChart;
