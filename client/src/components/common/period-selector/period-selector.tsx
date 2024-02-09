"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { useMemo } from "react";
import { isPeriodSelectorValue } from "./types";

interface PeriodSelectorProps {}

export const PeriodSelector: React.FC<PeriodSelectorProps> = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const period = useMemo(() => {
    const p = searchParams?.get("period") ?? "";

    return isPeriodSelectorValue(p) ? p : "";
  }, [searchParams]);

  const onPeriodChange = (newPeriod: string) => {
    if (!pathname) {
      return;
    }

    const params = new URLSearchParams(searchParams?.toString());

    params.set("period", newPeriod);

    if (newPeriod === "") {
      params.delete("period");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      defaultValue={!!period ? period : " "}
      onValueChange={onPeriodChange}
    >
      <SelectTrigger className="text-muted-foreground max-w-[200px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectItem value={" "}>All Time</SelectItem>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="14d">Last 14 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
      </SelectContent>
    </Select>
  );
};
