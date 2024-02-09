-- DropForeignKey
ALTER TABLE "AuctionPhoto" DROP CONSTRAINT "AuctionPhoto_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_auctionId_fkey";

-- AddForeignKey
ALTER TABLE "AuctionPhoto" ADD CONSTRAINT "AuctionPhoto_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
