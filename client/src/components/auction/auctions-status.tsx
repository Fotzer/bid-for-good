import type { HTMLAttributes } from "react";

import { CheckCircle2, Clock, File } from "lucide-react";
import type { LucideIcon } from "lucide-react/dist/lucide-react";

import { cn } from "@/lib/utils";
import { AuctionStatus as AuctionStatusT } from "@/types/auction";

type FriendlyStatus = {
  label: string;
  icon?: LucideIcon;
  color: string;
};

const FRIENDLY_STATUS_MAP: Record<AuctionStatusT, FriendlyStatus> = {
  ALL: {
    label: "All",
    icon: Clock,
    color: "text-blue-600 dark:text-blue-300",
  },
  MY: {
    label: "Personal",
    icon: CheckCircle2,
    color: "text-green-500 dark:text-green-300",
  },
};

export type DocumentStatusProps = HTMLAttributes<HTMLSpanElement> & {
  status: AuctionStatusT;
  inheritColor?: boolean;
};

export const AuctionStatus = ({
  className,
  status,
  inheritColor,
  ...props
}: DocumentStatusProps) => {
  const { label, icon: Icon, color } = FRIENDLY_STATUS_MAP[status];

  return (
    <span className={cn("flex items-center", className)} {...props}>
      {Icon && (
        <Icon
          className={cn("mr-2 inline-block h-4 w-4", {
            [color]: !inheritColor,
          })}
        />
      )}
      {label}
    </span>
  );
};
