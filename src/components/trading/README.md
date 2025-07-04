# Trading Components

This folder contains self-contained components for the spot trading page. They
wrap Binance REST and WebSocket APIs via the provided GraphQL trading service
whenever possible.

## Components

### `OrderBook`
Displays realtime order book updates.
- REST: `GET https://api.binance.com/api/v3/depth`
- WS: `wss://stream.binance.com:9443/ws/{symbol}@depth`
- Props: `{ symbol: string; limit?: number }`

### `TradeList`
Realtime trade feed.
- WS: `wss://stream.binance.com:9443/ws/{symbol}@trade`
- Props: `{ symbol: string }`

### `Ticker`
Latest price and change.
- WS: `wss://stream.binance.com:9443/ws/{symbol}@miniTicker`
- Props: `{ symbol: string }`

### `CandlestickChart`
OHLC chart with live updates.
- REST: `GET /api/v3/klines`
- WS: `wss://stream.binance.com:9443/ws/{symbol}@kline_{interval}`
- Props: `{ symbol: string; interval: string }`

### `MarketSearch`
Search and filter markets using `exchangeInfo` query.
- GraphQL Query: `exchangeInfo`
- Props: `{ quoteFilter?: string; onSelect?: (symbol: string) => void }`

### `OrderForm`
Simple authenticated order form.
- GraphQL Mutation: `placeOrder` (placeholder)
- Props: `{ symbol: string; authToken: string }`

### `OpenOrders`
Table of open orders for the authenticated user.
- GraphQL Query: `openOrders(symbol: String)`
- Props: `{ authToken: string; symbol?: string }`
