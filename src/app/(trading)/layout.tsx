import type { Metadata } from "next";
import { WalletProvider } from "@/components/wallet/wallet-provider";
import { TradingHeader } from "@/components/trading/trading-header";

// Import wallet adapter styles for modal
import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata: Metadata = {
  title: "Fluxa Trading Desk",
  description: "Manage your concentrated liquidity positions on Solana",
};

interface TradingLayoutProps {
  children: React.ReactNode;
}

/**
 * Trading app layout with wallet provider and persistent navigation.
 * Separate from marketing site for clear separation of concerns and
 * independent authentication/layout requirements.
 */
export default function TradingLayout({ children }: TradingLayoutProps) {
  return (
    <WalletProvider>
      <div className="flex min-h-screen flex-col bg-[color:var(--background)]">
        <TradingHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-xs text-[color:var(--text-subtle)] sm:px-6 lg:px-8">
            <span>© 2025 Fluxa. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="/docs" className="hover:text-[color:var(--brand)]">
                Docs
              </a>
              <a href="/support" className="hover:text-[color:var(--brand)]">
                Support
              </a>
              <a
                href="https://solscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[color:var(--brand)]"
              >
                Explorer
              </a>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
