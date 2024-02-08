"use client";

import { HTMLAttributes } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MobileNavProps = HTMLAttributes<HTMLDivElement>;

export const MobileNav = ({ className, ...props }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start gap-x-2 gap-y-4",
        className
      )}
      {...props}
    >
      <Link href="/profile">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            pathname?.startsWith("/profile") && "bg-secondary"
          )}
        >
          <User className="mr-2 h-5 w-5" />
          Profile
        </Button>
      </Link>
    </div>
  );
};
