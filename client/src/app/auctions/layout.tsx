import React from "react";

import { Header } from "@/components/layout/header";

export type AuctionsProps = {
  children: React.ReactNode;
};

export default async function Auctions({ children }: AuctionsProps) {
  return (
    <>
      <Header />

      <main className="mt-8 pb-8 md:mt-12 md:pb-12">{children}</main>
    </>
  );
}
