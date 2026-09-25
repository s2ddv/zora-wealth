import type { WalletDto } from "@/types/dashboard";

/**
 * MOCK de carteiras e holdings.
 * Substituir na Fase 6 (Alchemy — balances on-chain)
 * Fase 5 (CoinGecko — preços e variações)
 * e na Fase 7 (portfolio engine — valuation agregada).
 */
export const mockWallets: WalletDto[] = [
  {
    id: "wallet-eth-main",
    nickname: "Tesouro ETH",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    chain: "ethereum",
    valueUsd: 48210.71,
    assets: [
      {
        id: "eth-eth",
        symbol: "ETH",
        name: "Ethereum",
        amount: 12.4,
        priceUsd: 3482.11,
        valueUsd: 43178.16,
        change24h: 1.84,
      },
      {
        id: "eth-usdc",
        symbol: "USDC",
        name: "USD Coin",
        amount: 3200,
        priceUsd: 1,
        valueUsd: 3200,
        change24h: 0.01,
      },
      {
        id: "eth-link",
        symbol: "LINK",
        name: "Chainlink",
        amount: 95,
        priceUsd: 19.29,
        valueUsd: 1832.55,
        change24h: -2.41,
      },
    ],
  },
  {
    id: "wallet-base-spend",
    nickname: "Base cotidiana",
    address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    chain: "base",
    valueUsd: 8739.40,
    assets: [
      {
        id: "base-eth",
        symbol: "ETH",
        name: "Ethereum",
        amount: 1.8,
        priceUsd: 3482.11,
        valueUsd: 6267.8,
        change24h: 1.84,
      },
      {
        id: "base-aero",
        symbol: "AERO",
        name: "Aerodrome",
        amount: 1850,
        priceUsd: 1.336,
        valueUsd: 2471.6,
        change24h: 4.12,
      },
    ],
  },
  {
    id: "wallet-sol-alpha",
    nickname: "Alpha Solana",
    address: "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
    chain: "solana",
    valueUsd: 15321.48,
    assets: [
      {
        id: "sol-sol",
        symbol: "SOL",
        name: "Solana",
        amount: 64.2,
        priceUsd: 178.4,
        valueUsd: 11453.28,
        change24h: -0.92,
      },
      {
        id: "sol-jup",
        symbol: "JUP",
        name: "Jupiter",
        amount: 4200,
        priceUsd: 0.921,
        valueUsd: 3868.2,
        change24h: 6.05,
      },
    ],
  },
];
