"use client";

import { HTMLAttributes } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DesktopNavProps = HTMLAttributes<HTMLDivElement>;

export const DesktopNav = ({ className, ...props }: DesktopNavProps) => {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col gap-y-2", className)} {...props}>
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
