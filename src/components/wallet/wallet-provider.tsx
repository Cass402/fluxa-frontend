"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletProviderProps {
  children: React.ReactNode;
}

/**
 * Wallet provider wrapping the entire trading app with Solana wallet adapters.
 * Supports Phantom, Solflare, Coinbase, and Ledger wallets.
 *
 * Uses Helius RPC for enhanced performance and decoded transaction support.
 * Falls back to public RPC if Helius endpoint is unavailable.
 */
export function WalletProvider({ children }: WalletProviderProps) {
  // Determine RPC endpoint based on environment
  const endpoint = useMemo(() => {
    // Use Helius RPC if API key is configured
    if (process.env.NEXT_PUBLIC_HELIUS_API_KEY) {
      return `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;
    }
    // Fallback to public Solana RPC (rate limited)
    return clusterApiUrl("mainnet-beta");
  }, []);

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
