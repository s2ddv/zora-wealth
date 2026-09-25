/**
 * DTOs do dashboard (Fase 4).
 * Prontos para migrar para `packages/shared` quando as APIs reais forem ligadas.
 */

export type ChainId = "ethereum" | "polygon" | "base" | "arbitrum" | "solana";

export interface WalletAssetDto {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  priceUsd: number;
  valueUsd: number;
  change24h: number;
}

export interface WalletDto {
  id: string;
  nickname: string;
  address: string;
  chain: ChainId;
  valueUsd: number;
  assets: WalletAssetDto[];
}

export interface AddWalletInput {
  nickname: string;
  address: string;
  chain: ChainId;
}

export interface MarketAssetDto {
  id: string;
  rank: number;
  symbol: string;
  name: string;
  imageUrl: string;
  priceUsd: number;
  change24h: number;
  marketCapUsd: number;
  volume24hUsd: number;
  isWatchlisted: boolean;
}

export interface TrendingAssetDto {
  id: string;
  symbol: string;
  name: string;
  change24h: number;
}

export type NewsCategory = "crypto" | "macro";

export interface NewsItemDto {
  id: string;
  title: string;
  url: string;
  source: string;
  category: NewsCategory;
  publishedAt: string;
}

export interface UserProfileDto {
  displayName: string;
  email: string;
  avatarUrl: string | null;
}

export type FiatCurrency = "USD" | "BRL" | "EUR";
export type ThemePreference = "dark" | "light" | "system";

export interface UserPreferencesDto {
  currency: FiatCurrency;
  theme: ThemePreference;
}

export interface ExchangeConnectionDto {
  id: string;
  name: string;
  status: "coming_soon";
}
