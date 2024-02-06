"use client";

import type { HTMLAttributes } from "react";
import { useEffect, useState } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { Icons } from "../common/icons";

import { ProfileDropdown } from "./profile-dropdown";

export type HeaderProps = HTMLAttributes<HTMLDivElement>;

export const Header = ({ className, ...props }: HeaderProps) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "supports-backdrop-blur:bg-background/60 bg-background/95 sticky top-0 z-[60] flex h-16 w-full items-center border-b border-b-transparent backdrop-blur duration-200",
        scrollY > 5 && "border-b-border",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-4 px-4 md:px-8">
        <Link
          href="/"
          className="focus-visible:ring-ring ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 flex space-x-4 items-center"
        >
          <Icons.logo className="h-8 w-auto" />
          <h1 className="text-2xl font-semibold">BidForGood</h1>
        </Link>

        <div className="flex gap-x-4 md:ml-8">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
