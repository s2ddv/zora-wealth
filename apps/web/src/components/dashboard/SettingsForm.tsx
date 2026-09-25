"use client";

import { useState } from "react";
import type { FiatCurrency, ThemePreference, UserPreferencesDto, UserProfileDto } from "@/types/dashboard";

const inputClass = "w-full rounded-2xl border border-outline-variant/50 bg-surface px-4 py-3 text-body-base text-on-surface outline-none focus:border-primary";

export function SettingsForm({ profile, preferences }: { profile: UserProfileDto; preferences: UserPreferencesDto }) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [currency, setCurrency] = useState<FiatCurrency>(preferences.currency);
  const [theme, setTheme] = useState<ThemePreference>(preferences.theme);
  const [message, setMessage] = useState("");

  return (
    <form className="flex flex-col gap-6" onChange={() => setMessage("")} onSubmit={(event) => {
      event.preventDefault();
      setMessage("Demonstração concluída. As alterações não foram salvas nem aplicadas ao dashboard.");
    }}>
      <section id="profile" aria-labelledby="profile-title" className="scroll-mt-24 rounded-3xl border border-outline-variant/30 bg-surface-container p-6">
        <h2 id="profile-title" className="mb-6 flex items-center gap-2 text-headline-md font-bold"><span aria-hidden="true" className="material-symbols-outlined text-primary">account_circle</span>Perfil</h2>
        <div className="grid gap-5 xl:grid-cols-2">
          <label className="flex flex-col gap-2"><span className="text-body-sm text-on-surface-variant">Nome de exibição</span><input name="displayName" required maxLength={80} autoComplete="nickname" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={inputClass} /></label>
          <label className="flex flex-col gap-2"><span className="text-body-sm text-on-surface-variant">E-mail de demonstração</span><input name="email" type="email" readOnly value={profile.email} className={`${inputClass} text-on-surface-variant`} /></label>
        </div>
      </section>
      <section aria-labelledby="preferences-title" className="rounded-3xl border border-outline-variant/30 bg-surface-container p-6">
        <h2 id="preferences-title" className="mb-2 flex items-center gap-2 text-headline-md font-bold"><span aria-hidden="true" className="material-symbols-outlined text-primary">tune</span>Preferências</h2>
        <p id="preferences-help" className="mb-6 text-body-sm text-on-surface-variant">Seleções de demonstração. O dashboard permanece em USD e com aparência escura nesta versão.</p>
        <div className="grid gap-5 xl:grid-cols-2">
          <label className="flex flex-col gap-2"><span className="text-body-sm text-on-surface-variant">Moeda</span><select name="currency" aria-describedby="preferences-help" value={currency} onChange={(event) => setCurrency(event.target.value as FiatCurrency)} className={inputClass}><option value="USD">USD — Dólar americano</option><option value="BRL">BRL — Real brasileiro</option><option value="EUR">EUR — Euro</option></select></label>
          <label className="flex flex-col gap-2"><span className="text-body-sm text-on-surface-variant">Tema</span><select name="theme" aria-describedby="preferences-help" value={theme} onChange={(event) => setTheme(event.target.value as ThemePreference)} className={inputClass}><option value="dark">Escuro</option><option value="light">Claro</option><option value="system">Sistema</option></select></label>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <p role="status" className="flex-1 text-body-sm text-primary">{message}</p>
        <button type="button" onClick={() => {
          setDisplayName(profile.displayName);
          setCurrency(preferences.currency);
          setTheme(preferences.theme);
          setMessage("Valores de demonstração restaurados.");
        }} className="rounded-full px-5 py-3 text-body-sm text-on-surface-variant hover:bg-surface-container-high">Restaurar</button>
        <button type="submit" className="rounded-full bg-primary px-5 py-3 text-body-sm font-medium text-on-primary hover:bg-primary/90">Concluir demonstração</button>
      </div>
    </form>
  );
}
