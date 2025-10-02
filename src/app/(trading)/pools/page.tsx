import { Metadata } from "next";

import { PoolsDirectory } from "./pools-directory";

export const metadata: Metadata = {
  title: "Fluxa Pools",
  description:
    "Discover Fluxa CLMM pools with AI guardrails and institutional telemetry.",
};

export default function PoolsPage() {
  return <PoolsDirectory />;
}
