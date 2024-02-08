"use client";

import Auction from "@/components/auction/auction";
import AuctionLoader from "@/components/auction/auction-loader";
import { IAuction } from "@/types/auction";
import axios from "axios";
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
    <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8">
      <h1 className="text-4xl font-semibold mb-6">Auctions</h1>
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
    </div>
  );
};

export default AuctionPage;
