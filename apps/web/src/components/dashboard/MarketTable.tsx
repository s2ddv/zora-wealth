import { changeToneClass, formatCompactUsd, formatPercent, formatUsd } from "@/lib/format";
import type { MarketAssetDto } from "@/types/dashboard";
import { WatchlistButton } from "./WatchlistButton";

export function MarketTable({ assets }: { assets: MarketAssetDto[] }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-outline-variant/30 bg-surface-container">
      <table className="w-full min-w-[800px] text-left text-body-sm">
        <caption className="sr-only">Mercado de criptoativos — valores simulados em USD</caption>
        <thead className="border-b border-outline-variant/30 text-label-caps uppercase text-on-surface-variant">
          <tr>
            <th scope="col" className="p-4"><span className="sr-only">Watchlist</span></th>
            <th scope="col" className="p-4">Rank</th>
            <th scope="col" className="p-4">Nome / Símbolo</th>
            <th scope="col" className="p-4 text-right">Preço</th>
            <th scope="col" className="p-4 text-right">24h</th>
            <th scope="col" className="p-4 text-right">Market cap</th>
            <th scope="col" className="p-4 text-right">Volume 24h</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-surface-container-high/50">
              <td className="px-4 py-3"><WatchlistButton name={asset.name} initialValue={asset.isWatchlisted} /></td>
              <td className="p-4 text-on-surface-variant">{asset.rank}</td>
              <th scope="row" className="p-4 font-medium">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">{asset.symbol.slice(0, 1)}</span>
                  <div>{asset.name}<p className="mt-1 text-on-surface-variant">{asset.symbol}</p></div>
                </div>
              </th>
              <td className="p-4 text-right font-mono">{formatUsd(asset.priceUsd)}</td>
              <td className={`p-4 text-right font-mono ${changeToneClass(asset.change24h)}`}>{formatPercent(asset.change24h)}</td>
              <td className="p-4 text-right font-mono">{formatCompactUsd(asset.marketCapUsd)}</td>
              <td className="p-4 text-right font-mono">{formatCompactUsd(asset.volume24hUsd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
