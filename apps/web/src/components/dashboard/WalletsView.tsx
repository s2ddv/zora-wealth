"use client";

import { useState } from "react";
import {
  CHAIN_LABELS,
  changeToneClass,
  formatPercent,
  formatTokenAmount,
  formatUsd,
  truncateAddress,
} from "@/lib/format";
import type { WalletDto } from "@/types/dashboard";
import { AddWalletModal } from "./AddWalletModal";

interface WalletsViewProps {
  wallets: WalletDto[];
}

export function WalletsView({ wallets }: WalletsViewProps) {
  const [selectedId, setSelectedId] = useState(wallets[0]?.id ?? null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selected = wallets.find((wallet) => wallet.id === selectedId) ?? wallets[0];

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label-caps uppercase text-on-surface-variant">Accounts</p>
          <h1 className="text-headline-lg font-bold text-on-surface">Wallets</h1>
          <p className="mt-1 text-body-base text-on-surface-variant">
            Carteiras monitoradas e composição de ativos (dados mockados).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-on-primary hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Adicionar carteira
        </button>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <ul className="flex flex-col gap-3">
          {wallets.map((wallet) => {
            const isActive = wallet.id === selected?.id;
            return (
              <li key={wallet.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(wallet.id)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center justify-between gap-4 rounded-3xl border px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "border-primary/40 bg-primary/10"
                      : "border-outline-variant/30 bg-surface-container hover:border-outline-variant/60"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-title-md font-semibold text-on-surface">
                      {wallet.nickname}
                    </p>
                    <p className="mt-1 break-all font-mono text-body-sm text-on-surface-variant">
                      {truncateAddress(wallet.address)}
                    </p>
                    <p className="mt-2 text-label-caps uppercase text-on-surface-variant">
                      {CHAIN_LABELS[wallet.chain]}
                    </p>
                  </div>
                  <p className="shrink-0 text-title-md font-semibold text-on-surface">
                    {formatUsd(wallet.valueUsd)}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="min-w-0 rounded-3xl border border-outline-variant/30 bg-surface-container p-6">
          {selected ? (
            <>
              <div className="mb-6">
                <p className="text-label-caps uppercase text-on-surface-variant">
                  Holdings
                </p>
                <h2 className="text-headline-md font-bold text-on-surface">
                  {selected.nickname}
                </h2>
                <p className="mt-1 break-all font-mono text-body-sm text-on-surface-variant">
                  {selected.address}
                </p>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-left">
                <caption className="sr-only">Ativos de {selected.nickname}</caption>
                <thead>
                  <tr className="text-label-caps uppercase text-on-surface-variant">
                    <th className="pb-3 font-medium">Ativo</th>
                    <th className="pb-3 font-medium">Qtd</th>
                    <th className="pb-3 font-medium">Preço</th>
                    <th className="pb-3 text-right font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.assets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="border-t border-outline-variant/20"
                    >
                      <td className="py-3">
                        <p className="text-body-base font-medium text-on-surface">
                          {asset.name}
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                          {asset.symbol}
                          <span className={`ml-2 ${changeToneClass(asset.change24h)}`}>
                            {formatPercent(asset.change24h)}
                          </span>
                        </p>
                      </td>
                      <td className="py-3 font-mono text-body-sm text-on-surface">
                        {formatTokenAmount(asset.amount)}
                      </td>
                      <td className="py-3 font-mono text-body-sm text-on-surface">
                        {formatUsd(asset.priceUsd)}
                      </td>
                      <td className="py-3 text-right font-mono text-body-sm text-on-surface">
                        {formatUsd(asset.valueUsd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          ) : (
            <p className="text-body-base text-on-surface-variant">
              Nenhuma carteira cadastrada.
            </p>
          )}
        </div>
      </div>

      <AddWalletModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
