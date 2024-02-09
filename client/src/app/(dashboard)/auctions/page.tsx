"use client";

import Auction from "@/components/auction/auction";
import AuctionLoader from "@/components/auction/auction-loader";
import { AuctionStatus } from "@/components/auction/auctions-status";
import { PeriodSelector } from "@/components/common/period-selector/period-selector";
import {
  PeriodSelectorValue,
  isPeriodSelectorValue,
} from "@/components/common/period-selector/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isAuctionStatus } from "@/lib/guards/is-auction-status";
import { isWithinPeriod } from "@/lib/utils";
import { useAuth } from "@/providers/auth";
import { AuctionStatus as AuctionStatusT, IAuction } from "@/types/auction";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "react-query";

const AuctionPage = () => {
  const searchParams = useSearchParams();

  const {
    data: auctions,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: "auctions",
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auctions`
      );

      return data as IAuction[];
    },
  });

  const { user } = useAuth();

  const status = isAuctionStatus(searchParams.get("status"))
    ? searchParams.get("status")
    : "ALL";
  const period = (
    isPeriodSelectorValue(searchParams.get("period"))
      ? searchParams.get("period")
      : ""
  ) as PeriodSelectorValue;

  const myAuctions = useMemo(
    () =>
      auctions?.filter(
        (auction) =>
          auction.userId === user?.id &&
          isWithinPeriod(auction.createdAt, period)
      ),
    [auctions, user?.id, period]
  );

  const allAuctions = useMemo(
    () =>
      auctions?.filter((auction) => isWithinPeriod(auction.createdAt, period)),
    [auctions, period]
  );
  const getTabHref = (value: typeof status) => {
    const params = new URLSearchParams(searchParams);

    params.set("status", value ?? "");

    if (params.has("page")) {
      params.delete("page");
    }

    return `/auctions?${params.toString()}`;
  };

  const loaderSkeletons = Array(6)
    .fill(0)
    .map((_, i) => <AuctionLoader key={i} />);

  const content = (
    status === AuctionStatusT.ALL ? allAuctions : myAuctions
  )?.map((auction) => <Auction key={auction.id} auction={auction} />);

  return (
    <>
      <div className="flex mb-4 sm:mb-0 flex-col sm:flex-row justify-between">
        <div className="flex gap-6 items-center mb-6">
          <h1 className="text-4xl font-semibold">Auctions</h1>
          <div className="flex  items-center gap-2">
            <Tabs defaultValue={status ?? ""} className="overflow-x-auto">
              <TabsList>
                {[AuctionStatusT.ALL, AuctionStatusT.MY].map((value) => (
                  <TabsTrigger
                    key={value}
                    className="hover:text-foreground min-w-[60px]"
                    value={value}
                    asChild
                  >
                    <Link href={getTabHref(value)} scroll={false}>
                      <AuctionStatus status={value} />
                      <span className="ml-1 inline-block opacity-50">
                        {value === AuctionStatusT.ALL
                          ? allAuctions?.length
                          : myAuctions?.length}
                      </span>
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex w-48 flex-wrap items-center justify-between gap-x-2 gap-y-4">
              <PeriodSelector />
            </div>
          </div>
        </div>
        <Link href={"/auctions/new"}>
          <Button size={"lg"}>
            <Plus className="-ml-2 mr-2 h-5 w-5" />
            New Auction
          </Button>
        </Link>
      </div>
      {isError ? (
        <h2 className="text-center font-semibold text-red-500 text-lg md:text-2xl">
          An Error ocurred during auctions load
        </h2>
      ) : null}
      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? loaderSkeletons : isSuccess ? content : null}
      </div>
    </>
  );
};

export default AuctionPage;
