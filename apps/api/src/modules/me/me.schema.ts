import { z } from "zod";
import { CHAINS } from "@zora-wealth/shared";

const ethAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

export const createWalletSchema = z.object({
  address: ethAddress,
  chain: z.enum(CHAINS).default("ETHEREUM"),
  nickname: z.string().trim().min(1).max(64).optional(),
});

export const walletIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const createWatchlistSchema = z.object({
  coinId: z.string().trim().min(1).max(128),
});

export const watchlistCoinParamsSchema = z.object({
  coinId: z.string().min(1),
});

export const createSnapshotSchema = z.object({
  totalUsd: z.number().nonnegative(),
});

export const snapshotQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

export type CreateWalletBody = z.infer<typeof createWalletSchema>;
export type CreateWatchlistBody = z.infer<typeof createWatchlistSchema>;
export type CreateSnapshotBody = z.infer<typeof createSnapshotSchema>;
