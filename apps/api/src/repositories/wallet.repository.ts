import { prisma } from "../lib/prisma.js";
import { Chain } from "@zora-wealth/database";

export const walletRepository = {
  create(userId: string, address: string, chain: Chain, nickname?: string) {
    return prisma.wallet.create({
      data: { userId, address, chain, nickname },
    });
  },

  findByUser(userId: string) {
    return prisma.wallet.findMany({
      where: { userId },
      include: { assets: true },
    });
  },

  findById(id: string, userId: string) {
    return prisma.wallet.findFirst({
      where: { id, userId },
      include: { assets: true },
    });
  },

  updateNickname(id: string, userId: string, nickname: string) {
    return prisma.wallet.updateMany({
      where: { id, userId },
      data: { nickname },
    });
  },

  delete(id: string, userId: string) {
    return prisma.wallet.deleteMany({
      where: { id, userId },
    });
  },
};