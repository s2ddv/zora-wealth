export const CHAINS = [
  "ETHEREUM",
  "POLYGON",
  "ARBITRUM",
  "BASE",
  "SOLANA",
  "BITCOIN",
] as const;

export type Chain = (typeof CHAINS)[number];

export const EXCHANGES = [
  "COINBASE",
  "BINANCE",
  "KRAKEN",
  "BYBIT",
] as const;

export type Exchange = (typeof EXCHANGES)[number];

export interface UserDto {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WalletAssetDto {
  id: string;
  symbol: string;
  amount: string;
  walletId: string;
  updatedAt: string;
}

export interface WalletDto {
  id: string;
  address: string;
  chain: Chain;
  nickname: string | null;
  userId: string;
  assets: WalletAssetDto[];
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistItemDto {
  id: string;
  coinId: string;
  addedAt: string;
}

export interface WatchlistDto {
  id: string;
  name: string;
  userId: string;
  items: WatchlistItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWatchlistInput {
  name: string;
}

export interface AddWatchlistItemInput {
  coinId: string;
}

export interface PortfolioSnapshotDto {
  id: string;
  totalUsd: string;
  userId: string;
  createdAt: string;
}

export interface CreateWalletInput {
  address: string;
  chain?: Chain;
  nickname?: string | undefined;
}

export interface CreatePortfolioSnapshotInput {
  totalUsd: number;
}
