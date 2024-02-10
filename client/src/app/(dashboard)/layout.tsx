"use client";

import { Header } from "@/components/layout/header";
import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type AuctionsProps = {
  children: React.ReactNode;
};

export default function Auctions({ children }: AuctionsProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]);

  return (
    <>
      <Header />

      <main className="mt-8 pb-8 md:mt-12 md:pb-12">{children}</main>
    </>
  );
}
