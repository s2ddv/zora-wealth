import type { PrismaClient } from "@zora-wealth/database";

export class WatchlistRepository {
  constructor(private readonly db: PrismaClient) {}

  findByUserId(userId: string) {
    return this.db.watchlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  create(userId: string, coinId: string) {
    return this.db.watchlist.create({
      data: { userId, coinId },
    });
  }

  delete(userId: string, coinId: string) {
    return this.db.watchlist.deleteMany({
      where: { userId, coinId },
    });
  }
}
