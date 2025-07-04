import { render } from "@testing-library/react";
import TradeList from "../TradeList";
import { describe, it, expect, vi } from "vitest";

vi.stubGlobal("WebSocket", class {
  onmessage: ((ev: any) => void) | null = null;
  close() {}
  constructor() {
    setTimeout(() => {
      this.onmessage?.({ data: JSON.stringify({ t: 1, p: "1", q: "1", T: 0, m: true }) });
    }, 10);
  }
});

describe("TradeList", () => {
  it("renders component", () => {
    const { container } = render(<TradeList symbol="BTCUSDT" />);
    expect(container).toBeTruthy();
  });
});
