import { render, screen } from "@testing-library/react";
import OrderBook from "../OrderBook";
import { describe, it, expect, vi } from "vitest";

vi.stubGlobal("WebSocket", class {
  onmessage: ((ev: any) => void) | null = null;
  close() {}
  constructor() {
    setTimeout(() => {
      this.onmessage?.({ data: JSON.stringify({ b: [], a: [] }) });
    }, 10);
  }
});

vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ bids: [], asks: [] }),
    })
  ) as any
);

describe("OrderBook", () => {
  it("renders loading", () => {
    render(<OrderBook symbol="BTCUSDT" />);
    expect(screen.getByText(/Loading/)).toBeTruthy();
  });
});
