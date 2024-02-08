import { IAuction } from "@/types/auction";
import { parseISO, format } from "date-fns";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";

interface AuctionProps {
  auction: IAuction;
}

const Auction: React.FC<AuctionProps> = ({ auction }) => {
  const auctionCreatedAt = parseISO(auction.createdAt);
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex-row gap-4 items-center">
        <div>
          <CardTitle>{auction.name}</CardTitle>
          <CardDescription>
            {format(auctionCreatedAt, "MMMM dd, yyyy HH:mm:ss")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative w-full h-[200px]">
          <Image
            src={auction.mainPhoto}
            alt={auction.name}
            fill
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <p className="text-black/85">{auction.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col-reverse items-stretch gap-2">
        <Button>View Auction</Button>
        <div className="flex gap-2">
          <p className="font-semibold text-lg">Start Price: </p>
          <Badge variant="outline">{auction.startPrice} $</Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Auction;
