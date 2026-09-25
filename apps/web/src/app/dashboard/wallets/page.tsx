import { WalletsView } from "@/components/dashboard/WalletsView";
import { mockWallets } from "@/mocks/wallets";

export default function WalletsPage() {
  return <WalletsView wallets={mockWallets} />;
}
