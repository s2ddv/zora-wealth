"use client";

import { useState } from "react";

export function WatchlistButton({ name, initialValue }: { name: string; initialValue: boolean }) {
  const [selected, setSelected] = useState(initialValue);

  return (
    <button
      type="button"
      aria-label={`${selected ? "Remover" : "Adicionar"} ${name} ${selected ? "da" : "à"} watchlist`}
      aria-pressed={selected}
      onClick={() => setSelected((value) => !value)}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary ${selected ? "text-primary" : "text-on-surface-variant"}`}
    >
      <span aria-hidden="true" className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${selected ? 1 : 0}` }}>star</span>
    </button>
  );
}
