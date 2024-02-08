"use client";

import Link from "next/link";

import { Github, LogOut, User as LucideUser } from "lucide-react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/providers/auth";
import { redirect, useRouter } from "next/navigation";

export type ProfileDropdownProps = {};

export const ProfileDropdown = (_: ProfileDropdownProps) => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          title="Profile Dropdown"
          className="relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>FN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-[60] w-56" align="end" forceMount>
        <DropdownMenuLabel>Account</DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <LucideUser className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="https://github.com/GEOFARL/bid-for-good"
            className="cursor-pointer"
            target="_blank"
          >
            <Github className="mr-2 h-4 w-4" />
            Star on Github
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            logout!();
            router.push("/sign-in");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
