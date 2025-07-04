import React, { useState } from "react";

interface Props {
  symbol: string;
  authToken: string;
}

/**
 * Order form supporting Limit/Market/StopLimit. On submit it posts to trading
 * service (placeholder mutation). Requires JWT for auth.
 */
const OrderForm: React.FC<Props> = ({ symbol, authToken }) => {
  const [type, setType] = useState("LIMIT");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  const submit = async () => {
    await fetch("http://localhost:5003/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: `mutation Place($symbol:String!,$side:String!,$type:String!,$price:String,$quantity:String!){\n  placeOrder(symbol:$symbol,side:$side,type:$type,price:$price,quantity:$quantity){ id }\n}`,
        variables: {
          symbol,
          side: "BUY",
          type,
          price,
          quantity: qty,
        },
      }),
    });
  };

  return (
    <div className="text-xs space-y-2">
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="LIMIT">Limit</option>
        <option value="MARKET">Market</option>
        <option value="STOP_LOSS_LIMIT">Stop Limit</option>
      </select>
      {type !== "MARKET" && (
        <input
          className="border p-1 w-full"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
      )}
      <input
        className="border p-1 w-full"
        placeholder="Quantity"
        value={qty}
        onChange={e => setQty(e.target.value)}
      />
      <button className="bg-yellow-400 px-2" onClick={submit}>
        Submit
      </button>
    </div>
  );
};

export default OrderForm;
