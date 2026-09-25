import Link from "next/link";
import { NewsCard } from "@/components/dashboard/newsCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { mockNews, mockNewsReferenceTime } from "@/mocks/news";

const filters = [
  { value: "all", label: "Todas", href: "/dashboard/news" },
  { value: "crypto", label: "Crypto", href: "/dashboard/news?category=crypto" },
  { value: "macro", label: "Macro", href: "/dashboard/news?category=macro" },
];

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const { category } = await searchParams;
  const activeCategory = category === "crypto" || category === "macro" ? category : "all";
  const items = mockNews.filter((item) => activeCategory === "all" || item.category === activeCategory);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Insights" title="News" description="Acompanhe Crypto e Macro. Notícias fictícias para demonstração da interface." />
      <nav aria-label="Filtrar notícias por categoria" className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link key={filter.value} href={filter.href} aria-current={activeCategory === filter.value ? "page" : undefined} className={`rounded-full border px-5 py-2 text-body-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${activeCategory === filter.value ? "border-primary bg-primary text-on-primary" : "border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}>
            {filter.label}
          </Link>
        ))}
      </nav>
      <section aria-label="Feed de notícias">
        <p className="mb-4 text-body-sm text-on-surface-variant">{items.length} notícias · Tempos relativos à amostra de 24/09/2026, 18:00 UTC.</p>
        <ul className="grid gap-4 xl:grid-cols-2">
          {items.map((item) => <li key={item.id}><NewsCard item={item} referenceTime={Date.parse(mockNewsReferenceTime)} /></li>)}
        </ul>
      </section>
    </div>
  );
}
