// services/FetchData.tsx
export const fetchCryptoPrices = async () => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether,ethereum,binancecoin&vs_currencies=usd'
  );
  const data = await response.json();
  return {
    BTC: data.bitcoin?.usd || 0,
    ETH: data.ethereum?.usd || 0,
    BNB: data.binancecoin?.usd || 0,
    USDT: data.tether?.usd || 1, // Default to 1 if API fails
  };
};