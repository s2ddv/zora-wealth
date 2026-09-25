import { MarketTable } from "@/components/dashboard/MarketTable";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { changeToneClass, formatPercent } from "@/lib/format";
import { mockMarketAssets, mockTrendingAssets } from "@/mocks/markets";

export default function MarketsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Explore" title="Markets" description="Preços e tendências em USD. Dados de demonstração; a watchlist vale apenas nesta visita." />
      <section aria-labelledby="trending-title">
        <h2 id="trending-title" className="mb-4 flex items-center gap-2 text-headline-md font-bold">
          <span aria-hidden="true" className="material-symbols-outlined text-primary">trending_up</span>
          Trending
        </h2>
        <ul className="grid gap-4 xl:grid-cols-3">
          {mockTrendingAssets.map((asset, index) => (
            <li key={asset.id} className="flex items-center gap-4 rounded-3xl border border-outline-variant/30 bg-surface-container p-5">
              <span className="text-headline-md text-primary">0{index + 1}</span>
              <div className="flex-1"><p className="font-semibold">{asset.name}</p><p className="text-body-sm text-on-surface-variant">{asset.symbol}</p></div>
              <span className={`font-mono text-body-sm ${changeToneClass(asset.change24h)}`}>{formatPercent(asset.change24h)}</span>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="market-title">
        <h2 id="market-title" className="mb-4 text-headline-md font-bold">Todos os ativos</h2>
        <MarketTable assets={mockMarketAssets} />
      </section>
    </div>
  );
}
