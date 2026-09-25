import { PageHeader } from "@/components/dashboard/PageHeader";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { mockExchangeConnections, mockUserPreferences, mockUserProfile } from "@/mocks/settings";

export default function SettingsPage() {
  return (
    <div className="flex max-w-5xl flex-col gap-8">
      <PageHeader eyebrow="Account" title="Settings" description="Perfil, preferências e conexões. Interface de demonstração, sem persistência." />
      <SettingsForm profile={mockUserProfile} preferences={mockUserPreferences} />
      <section aria-labelledby="exchanges-title" className="rounded-3xl border border-outline-variant/30 bg-surface-container p-6">
        <h2 id="exchanges-title" className="mb-2 flex items-center gap-2 text-headline-md font-bold"><span aria-hidden="true" className="material-symbols-outlined text-primary">sync_alt</span>Conexões de exchange</h2>
        <p className="mb-6 text-body-sm text-on-surface-variant">Suas exchanges em um só lugar. As conexões estarão disponíveis em breve.</p>
        <ul className="divide-y divide-outline-variant/30">
          {mockExchangeConnections.map((exchange) => (
            <li key={exchange.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3"><span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{exchange.name[0]}</span><span className="font-medium">{exchange.name}</span></div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-surface-container-high px-3 py-1 text-body-sm text-on-surface-variant">Em breve</span>
                <button type="button" disabled aria-label={`Conectar ${exchange.name} — em breve`} className="cursor-not-allowed rounded-full border border-outline-variant px-4 py-2 text-body-sm text-on-surface-variant opacity-50">Conectar</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
