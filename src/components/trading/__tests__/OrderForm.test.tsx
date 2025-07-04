import { render, fireEvent } from "@testing-library/react";
import OrderForm from "../OrderForm";
import { describe, it, expect } from "vitest";

describe("OrderForm", () => {
  it("change type", () => {
    const { getByRole } = render(
      <OrderForm symbol="BTCUSDT" authToken="t" />
    );
    const select = getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "MARKET" } });
    expect(select.value).toBe("MARKET");
  });
});
