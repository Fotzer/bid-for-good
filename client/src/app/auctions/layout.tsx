"use client";

import React from "react";

import { Header } from "@/components/layout/header";
import { useAuth } from "@/providers/auth";
import { redirect } from "next/navigation";

export type AuctionsProps = {
  children: React.ReactNode;
};

export default function Auctions({ children }: AuctionsProps) {
  const { user } = useAuth();
  console.log(user);

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <Header />

      <main className="mt-8 pb-8 md:mt-12 md:pb-12">{children}</main>
    </>
  );
}
