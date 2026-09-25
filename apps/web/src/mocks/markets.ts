import type { MarketAssetDto, TrendingAssetDto } from "@/types/dashboard";

// MOCK: substituir na Fase 5 por preços, market cap, volume e trending do CoinGecko.
// A watchlist é apenas estado de UI na Fase 4; não persiste no servidor.
export const mockMarketAssets: MarketAssetDto[] = [
  { id: "bitcoin", rank: 1, name: "Bitcoin", symbol: "BTC", imageUrl: "", priceUsd: 67432.18, change24h: 2.31, marketCapUsd: 1328000000000, volume24hUsd: 28400000000, isWatchlisted: true },
  { id: "ethereum", rank: 2, name: "Ethereum", symbol: "ETH", imageUrl: "", priceUsd: 3482.11, change24h: 1.84, marketCapUsd: 418600000000, volume24hUsd: 15200000000, isWatchlisted: true },
  { id: "tether", rank: 3, name: "Tether", symbol: "USDT", imageUrl: "", priceUsd: 1, change24h: 0, marketCapUsd: 112400000000, volume24hUsd: 48600000000, isWatchlisted: false },
  { id: "solana", rank: 4, name: "Solana", symbol: "SOL", imageUrl: "", priceUsd: 178.4, change24h: -0.92, marketCapUsd: 82400000000, volume24hUsd: 3100000000, isWatchlisted: false },
  { id: "usd-coin", rank: 5, name: "USD Coin", symbol: "USDC", imageUrl: "", priceUsd: 1, change24h: 0.01, marketCapUsd: 32400000000, volume24hUsd: 6200000000, isWatchlisted: false },
  { id: "chainlink", rank: 6, name: "Chainlink", symbol: "LINK", imageUrl: "", priceUsd: 19.29, change24h: -2.41, marketCapUsd: 11740000000, volume24hUsd: 481000000, isWatchlisted: false },
  { id: "jupiter", rank: 7, name: "Jupiter", symbol: "JUP", imageUrl: "", priceUsd: 0.921, change24h: 6.05, marketCapUsd: 1243000000, volume24hUsd: 184000000, isWatchlisted: false },
];

export const mockTrendingAssets: TrendingAssetDto[] = ["jupiter", "bitcoin", "solana"].map((id) => {
  const asset = mockMarketAssets.find((item) => item.id === id)!;
  return { id: asset.id, name: asset.name, symbol: asset.symbol, change24h: asset.change24h };
});
