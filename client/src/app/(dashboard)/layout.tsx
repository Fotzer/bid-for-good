"use client";

import { Header } from "@/components/layout/header";
import { useAuth } from "@/providers/auth";

export type AuctionsProps = {
  children: React.ReactNode;
};

export default function Auctions({ children }: AuctionsProps) {
  useAuth();

  return (
    <>
      <Header />

      <main className="mt-8 pb-8 md:mt-12 md:pb-12">{children}</main>
    </>
  );
}
