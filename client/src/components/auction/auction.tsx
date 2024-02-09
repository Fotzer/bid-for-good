import { IAuction } from "@/types/auction";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
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
import { toast } from "../ui/use-toast";
import Link from "next/link";

interface AuctionProps {
  auction: IAuction;
  userId: number | undefined;
  token: string | null;
}

const Auction: React.FC<AuctionProps> = ({ auction, userId, token }) => {
  const queryClient = useQueryClient();

  const auctionCreatedAt = parseISO(auction.createdAt);
  const router = useRouter();

  const { mutate: deleteAuction, isLoading } = useMutation({
    mutationFn: async () => {
      return axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auctions/${auction.id}`
      );
    },
    onSuccess: () => {
      toast({
        title: "Auction deleted successfully",
        duration: 5000,
      });
      queryClient.invalidateQueries("auctions");
      router.refresh();
    },
    onError: () => {
      toast({
        title: "An unknown error occurred",
        variant: "destructive",
        description:
          "We encountered an unknown error while attempting to delete your auction. Please try again later.",
      });
    },
  });

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex-row gap-4 items-center justify-between">
        <div>
          <CardTitle>{auction.name}</CardTitle>
          <CardDescription>
            {format(auctionCreatedAt, "MMMM dd, yyyy HH:mm:ss")}
          </CardDescription>
        </div>

        {userId === auction.userId ? (
          <>
            <div className="self-start">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    aria-label="close modal"
                    variant="ghost"
                    className="h-6 w-6 p-0 rounded-md"
                    onClick={() => {}}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your auction and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        type="submit"
                        size="lg"
                        loading={isLoading}
                        onClick={() => {
                          deleteAuction();
                        }}
                      >
                        {isLoading ? "Deleting auction..." : "Continue"}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative w-full h-[200px]">
          <Image
            src={auction.mainPhoto as string}
            alt={auction.name}
            fill
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <p className="text-black/85">{auction.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col-reverse items-stretch gap-2">
        <Link href={`/auctions/${auction.id}`} className="w-full">
          <Button className="w-full">View Auction</Button>
        </Link>
        <div className="flex gap-2">
          <p className="font-semibold text-lg">Start Price: </p>
          <Badge variant="outline">{auction.startPrice} $</Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Auction;
