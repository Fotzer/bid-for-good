import CloseModal from "@/components/common/close-modal";
import AuctionForm from "@/components/forms/auction";
import React from "react";

const InterceptNewAuctionPage = () => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10">
      <div className="container flex items-center h-full max-w-3xl mx-auto">
        <div className="relative bg-white w-full h-fit py-12 px-4 md:px-6 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>

          <AuctionForm />
        </div>
      </div>
    </div>
  );
};

export default InterceptNewAuctionPage;
