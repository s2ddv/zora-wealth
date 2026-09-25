import type { ExchangeConnectionDto, UserPreferencesDto, UserProfileDto } from "@/types/dashboard";

// MOCK: substituir pela sessão/perfil autenticado e preferências persistidas
// quando o dashboard for integrado à API. Não contém dados pessoais reais.
export const mockUserProfile: UserProfileDto = {
  displayName: "Alex Rivera",
  email: "alex@example.com",
  avatarUrl: null,
};

export const mockUserPreferences: UserPreferencesDto = {
  currency: "USD",
  theme: "dark",
};

// MOCK: catálogo visual. Conexões reais dependem da futura integração de exchanges;
// o portfolio engine (Fase 7) consumirá os saldos quando essa integração existir.
export const mockExchangeConnections: ExchangeConnectionDto[] = [
  { id: "binance", name: "Binance", status: "coming_soon" },
  { id: "coinbase", name: "Coinbase", status: "coming_soon" },
  { id: "kraken", name: "Kraken", status: "coming_soon" },
];
