import type { Chain, PrismaClient } from "@zora-wealth/database";

export class WalletRepository {
  constructor(private readonly db: PrismaClient) {}

  create(data: {
    userId: string;
    address: string;
    chain: Chain;
    nickname?: string | null;
  }) {
    return this.db.wallet.create({
      data,
      include: { assets: true },
    });
  }

  findByUserId(userId: string) {
    return this.db.wallet.findMany({
      where: { userId },
      include: { assets: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string, userId: string) {
    return this.db.wallet.findFirst({
      where: { id, userId },
      include: { assets: true },
    });
  }

  findByIdForUser(id: string, userId: string) {
    return this.db.wallet.findFirst({
      where: { id, userId },
      include: { assets: true },
    });
  }

  updateNickname(id: string, userId: string, nickname: string) {
    return this.db.wallet.updateMany({
      where: { id, userId },
      data: { nickname },
    });
  }

  delete(id: string, userId: string) {
    return this.db.wallet.deleteMany({
      where: { id, userId },
    });
  }

  async upsertAsset(
    walletId: string,
    symbol: string,
    amount: number | string,
    usdValue?: number | string | null,
    name?: string | null
  ) {
    const normalizedName = name ?? null;
    const normalizedUsdValue = usdValue ?? null;

    const existing = await this.db.walletAsset.findFirst({
      where: { walletId, symbol, contractAddress: null },
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
        contractAddress: null,
        amount,
        usdValue: normalizedUsdValue,
        name: normalizedName,
      },
    });
  }
}