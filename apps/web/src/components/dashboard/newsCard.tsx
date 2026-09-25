import { formatRelativeTime } from "@/lib/format";
import type { NewsItemDto } from "@/types/dashboard";

export function NewsCard({ item, referenceTime }: { item: NewsItemDto; referenceTime: number }) {
  return (
    <article className="h-full rounded-3xl border border-outline-variant/30 bg-surface-container p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3 text-body-sm text-on-surface-variant">
        <span aria-hidden="true" className="material-symbols-outlined text-primary">{item.category === "crypto" ? "currency_bitcoin" : "public"}</span>
        <span>{item.source}</span>
        <time dateTime={item.publishedAt} title={item.publishedAt}>há {formatRelativeTime(item.publishedAt, referenceTime)}</time>
      </div>
      <h2 className="text-title-md font-semibold">
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="rounded hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">{item.title}<span className="sr-only"> (abre em nova aba)</span></a>
        ) : item.title}
      </h2>
      <span className="mt-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-body-sm text-primary">{item.category === "crypto" ? "Crypto" : "Macro"}</span>
    </article>
  );
}
