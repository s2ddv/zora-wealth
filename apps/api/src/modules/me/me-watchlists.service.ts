import type { FastifyInstance } from "fastify";
import { WatchlistRepository } from "../../repositories/watchlist.repository.js";
import { toWatchlistDto, toWatchlistItemDto } from "../../lib/mappers.js";

export class MeWatchlistsService {
  private readonly watchlistRepo: WatchlistRepository;

  constructor(fastify: FastifyInstance) {
    this.watchlistRepo = new WatchlistRepository(fastify.prisma);
  }

  async list(userId: string) {
    const watchlists = await this.watchlistRepo.findAllByUserId(userId);
    return watchlists.map(toWatchlistDto);
  }

  async create(userId: string, name: string) {
    const watchlist = await this.watchlistRepo.create(userId, name);
    return toWatchlistDto(watchlist);
  }

  async remove(watchlistId: string, userId: string) {
    const result = await this.watchlistRepo.delete(watchlistId, userId);
    return result.count > 0;
  }

  async addItem(watchlistId: string, userId: string, coinId: string) {
    const watchlist = await this.watchlistRepo.findById(watchlistId, userId);
    if (!watchlist) return null;

    const item = await this.watchlistRepo.addItem(watchlistId, coinId);
    return toWatchlistItemDto(item);
  }

  async removeItem(watchlistId: string, userId: string, coinId: string) {
    const watchlist = await this.watchlistRepo.findById(watchlistId, userId);
    if (!watchlist) return false;

    const result = await this.watchlistRepo.removeItem(watchlistId, coinId);
    return result.count > 0;
  }
}