import { AuctionStatus } from "@/types/auction";

export const isAuctionStatus = (value: unknown): value is AuctionStatus => {
  if (typeof value !== "string") {
    return false;
  }

  // We're using the assertion for a type-guard so it's safe to ignore the eslint warning
  // eslint-disable-next-line
  return Object.values(AuctionStatus).includes(value as AuctionStatus);
};
