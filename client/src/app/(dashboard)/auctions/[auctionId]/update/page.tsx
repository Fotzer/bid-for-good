"use client";

import CloseModal from "@/components/common/close-modal";
import AuctionForm from "@/components/forms/auction";
import { IAuction } from "@/types/auction";
import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

const InterceptNewAuctionPage = ({
  params,
}: {
  params: { auctionId: string };
}) => {
  const queryClient = useQueryClient();

  const { data: auction } = useQuery({
    queryKey: ["auctions", params.auctionId],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auctions/${params.auctionId}`
      );

      let photos: string[] | null;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auctions/${params.auctionId}/auction-photos`
        );

        photos = res.data.map((photo: any) => photo.photoLink);
      } catch (err) {}

      // @ts-ignore
      return !photos
        ? (res.data as IAuction)
        : ({
            ...res.data,
            mainPhoto: [res.data.mainPhoto, ...photos],
          } as IAuction);
    },
    initialData: () => {
      return (queryClient.getQueryData("auctions") as IAuction[])?.find(
        (auction) => auction.id === params.auctionId
      );
    },
  });

  return auction ? (
    <div className="fixed inset-0 bg-zinc-900/20 z-10">
      <div className="container flex items-center h-full max-w-3xl mx-auto">
        <div className="relative bg-white w-full h-fit py-12 px-4 md:px-6 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>

          <AuctionForm auction={auction} />
        </div>
      </div>
    </div>
  ) : null;
};

export default InterceptNewAuctionPage;
