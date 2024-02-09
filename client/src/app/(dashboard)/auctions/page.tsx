"use client";

import Auction from "@/components/auction/auction";
import AuctionLoader from "@/components/auction/auction-loader";
import { Button } from "@/components/ui/button";
import { IAuction } from "@/types/auction";
import axios from "axios";
import { Plus, PlusSquare } from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";

const AuctionPage = () => {
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

  return (
    <>
      <div className="flex mb-4 sm:mb-0 flex-col sm:flex-row justify-between">
        <h1 className="text-4xl font-semibold mb-6">Auctions</h1>
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
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => <AuctionLoader key={i} />)
          : isSuccess
          ? auctions?.map((auction) => (
              <Auction key={auction.id} auction={auction} />
            ))
          : null}
      </div>
    </>
  );
};

export default AuctionPage;
