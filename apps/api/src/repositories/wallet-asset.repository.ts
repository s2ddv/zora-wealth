import type { PrismaClient } from "@zora-wealth/database";
import type { Prisma } from "@zora-wealth/database";

export class WalletAssetRepository {
  constructor(private readonly db: PrismaClient) {}

  findByWallet(walletId: string) {
    return this.db.walletAsset.findMany({
      where: { walletId },
    });
  }

  upsert(
    walletId: string,
    symbol: string,
    contractAddress: string | null,
    amount: Prisma.Decimal | number | string,
    usdValue?: Prisma.Decimal | number | string | null,
    name?: string,
  ) {
    return this.db.walletAsset.upsert({
      where: {
        walletId_symbol_contractAddress: {
          walletId,
          symbol,
          contractAddress: contractAddress ?? "",
        },
      },
      create: {
        walletId,
        symbol,
        contractAddress,
        amount,
        usdValue,
        name,
      },
      update: {
        amount,
        usdValue,
        name,
      },
    });
  }

  deleteByWallet(walletId: string) {
    return this.db.walletAsset.deleteMany({
      where: { walletId },
    });
  }
}