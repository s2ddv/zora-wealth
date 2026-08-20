import type { PrismaClient } from "@zora-wealth/database";

export class WalletAssetRepository {
  constructor(private readonly db: PrismaClient) {}

  findByWallet(walletId: string) {
    return this.db.walletAsset.findMany({
      where: { walletId },
    });
  }

  async upsert(
    walletId: string,
    symbol: string,
    contractAddress: string | null,
    amount: number | string,
    usdValue?: number | string | null,
    name?: string | null,
  ) {
    const normalizedName = name ?? null;
    const normalizedUsdValue = usdValue ?? null;

    const existing = await this.db.walletAsset.findFirst({
      where: {
        walletId,
        symbol,
        contractAddress: contractAddress ?? null,
      },
    });

    if (existing) {
      return this.db.walletAsset.update({
        where: { id: existing.id },
        data: {
          amount,
          usdValue: normalizedUsdValue,
          name: normalizedName,
        },
      });
    }

    return this.db.walletAsset.create({
      data: {
        walletId,
        symbol,
        contractAddress: contractAddress ?? null,
        amount,
        usdValue: normalizedUsdValue,
        name: normalizedName,
      },
    });
  }

  deleteByWallet(walletId: string) {
    return this.db.walletAsset.deleteMany({
      where: { walletId },
    });
  }
}