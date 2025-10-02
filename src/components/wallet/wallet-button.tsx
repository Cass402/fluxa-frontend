"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Copy, ExternalLink, LogOut, Wallet } from "lucide-react";
import { useState } from "react";

/**
 * Trust-first wallet button with clear security indicators.
 * Shows connection status, balance, and wallet actions.
 */
export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Truncate wallet address for display
  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null;

  const copyAddress = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey.toBase58());
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const viewExplorer = () => {
    if (!publicKey) return;
    window.open(
      `https://explorer.solana.com/address/${publicKey.toBase58()}`,
      "_blank"
    );
  };

  if (!connected) {
    return (
      <WalletMultiButton className="!h-10 !rounded-lg !bg-[color:var(--brand)] !px-4 !text-sm !font-semibold !text-white !transition-all hover:!bg-[color:var(--brand-hover)] focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[color:var(--brand)] focus-visible:!ring-offset-2">
        <Wallet className="mr-2 size-4" aria-hidden="true" />
        Connect Wallet
      </WalletMultiButton>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-3 py-2 text-sm font-medium text-[color:var(--foreground)] transition-all hover:border-[color:var(--brand-soft)] hover:bg-[color:var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2"
        aria-expanded={showDropdown ? "true" : "false"}
        aria-haspopup="true"
      >
        <div className="size-2 rounded-full bg-[color:var(--status-inRange-fg)]" />
        <span className="font-mono">{truncatedAddress}</span>
      </button>

      {/* Dropdown Menu */}
      {showDropdown ? (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
              {/* Wallet Address */}
              <div className="border-b border-[color:var(--border-subtle)] px-4 py-3">
                <p className="text-xs font-medium text-[color:var(--text-subtle)]">
                  Connected Wallet
                </p>
                <p className="mt-1 font-mono text-xs text-[color:var(--foreground)]">
                  {truncatedAddress}
                </p>
              </div>

              {/* Actions */}
              <button
                type="button"
                onClick={copyAddress}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-muted)]"
              >
                <Copy className="size-4 text-[color:var(--text-subtle)]" />
                {copiedAddress ? "Copied!" : "Copy Address"}
              </button>

              <button
                type="button"
                onClick={viewExplorer}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--surface-muted)]"
              >
                <ExternalLink className="size-4 text-[color:var(--text-subtle)]" />
                View on Explorer
              </button>

              <div className="border-t border-[color:var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => {
                    disconnect();
                    setShowDropdown(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[color:var(--status-danger-fg)] transition-colors hover:bg-[color:var(--status-danger-bg)]"
                >
                  <LogOut className="size-4" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
