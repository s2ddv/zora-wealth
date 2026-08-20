import type {
  PortfolioSnapshot,
  Wallet,
  WalletAsset,
  Watchlist,
} from "@zora-wealth/database";
import type {
  PortfolioSnapshotDto,
  WalletAssetDto,
  WalletDto,
  WatchlistItemDto,
} from "@zora-wealth/shared";

export function toWalletAssetDto(asset: WalletAsset): WalletAssetDto {
  return {
    id: asset.id,
    symbol: asset.symbol,
    amount: asset.amount.toString(),
    walletId: asset.walletId,
    updatedAt: asset.updatedAt.toISOString(),
  };
}

export function toWalletDto(
  wallet: Wallet & { assets: WalletAsset[] }
): WalletDto {
  return {
    id: wallet.id,
    address: wallet.address,
    chain: wallet.chain as WalletDto["chain"],
    nickname: wallet.nickname,
    userId: wallet.userId,
    assets: wallet.assets.map(toWalletAssetDto),
    createdAt: wallet.createdAt.toISOString(),
    updatedAt: wallet.updatedAt.toISOString(),
  };
}

export function toWatchlistItemDto(item: Watchlist): WatchlistItemDto {
  return {
    id: item.id,
    coinId: item.coinId,
    userId: item.userId,
    createdAt: item.createdAt.toISOString(),
  };
}

export function toPortfolioSnapshotDto(
  snapshot: PortfolioSnapshot
): PortfolioSnapshotDto {
  return {
    id: snapshot.id,
    totalUsd: snapshot.totalUsd.toString(),
    userId: snapshot.userId,
    createdAt: snapshot.createdAt.toISOString(),
  };
}
