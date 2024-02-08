import { DesktopNav } from "@/components/layout/profile/desktop-nav";
import { MobileNav } from "@/components/layout/profile/mobile-nav";
import { Metadata } from "next";
import React from "react";

export type ProfileProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfileLayout({ children }: ProfileProps) {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8">
      <h1 className="text-4xl font-semibold">Settings</h1>

      <div className="mt-4 grid grid-cols-12 gap-x-8 md:mt-8">
        <DesktopNav className="hidden md:col-span-3 md:flex" />
        <MobileNav className="col-span-12 mb-8 md:hidden" />

        <div className="col-span-12 md:col-span-9">{children}</div>
      </div>
    </div>
  );
}
