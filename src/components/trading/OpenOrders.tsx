import React, { useEffect, useState } from "react";

interface Order {
  orderId: number;
  symbol: string;
  price: string;
  origQty: string;
  side: string;
}

interface Props {
  authToken: string;
  symbol?: string;
}

/**
 * Displays authenticated open orders from trading-service GraphQL API.
 */
const OpenOrders: React.FC<Props> = ({ authToken, symbol }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5003/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            query: `query($symbol:String){ openOrders(symbol:$symbol) }`,
            variables: { symbol },
          }),
        });
        const json = await res.json();
        setOrders(json.data.openOrders);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchOrders();
  }, [authToken, symbol]);

  if (error) return <div>Error: {error}</div>;
  if (!orders.length) return <div>No open orders</div>;

  return (
    <table className="text-xs w-full">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Side</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.orderId}>
            <td>{o.symbol}</td>
            <td>{o.price}</td>
            <td>{o.origQty}</td>
            <td>{o.side}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OpenOrders;
