"use client";

import { IAuction } from "@/types/auction";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import AuctionLoader from "@/components/auction/auction-loader";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Pencil, Trash } from "lucide-react";
import Link from "next/link";

const AuctionDetailsPage = ({ params }: { params: { auctionId: string } }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: auction,
    isLoading,
    isError,
  } = useQuery({
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
      console.log("init", queryClient.getQueryData("auctions"));
      return (queryClient.getQueryData("auctions") as IAuction[])?.find(
        (auction) => auction.id === params.auctionId
      );
    },
  });

  const auctionCreatedAt = parseISO(auction?.createdAt ?? "");

  console.log(auction, auctionCreatedAt);
  return (
    <>
      {auction ? (
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col flex-1">
            <div className="flex lg:max-w-xl">
              <div className="flex-1">
                <h2 className="text-4xl font-semibold">{auction?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(auctionCreatedAt, "MMMM dd, yyyy HH:mm:ss")}
                </p>

                <div className="mt-3">
                  <span className="text-sm">Start Price: </span>
                  <Badge variant={"secondary"}>{auction.startPrice} $</Badge>
                </div>
              </div>
              <div className="flex flex-col-reverse items-center gap-2 self-start">
                {user?.id === auction.userId ? (
                  <div className="self-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href={`/auctions/${auction.id}/update`}
                            className="flex items-center gap-1.5"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-1.5">
                          <Trash className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : null}
              </div>
            </div>

            {auction.mainPhoto.length > 1 ? (
              <div className="px-14">
                <Carousel className="w-ful lg:max-w-[500px] xl:max-w-[600px] my-4">
                  <CarouselContent>
                    {(auction.mainPhoto as string[]).map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex items-center justify-center p-6">
                              <div className="h-[150px] sm:h-[200px] md:h-[300px] w-[500px] relative">
                                <Image
                                  src={photo}
                                  alt={photo}
                                  fill
                                  objectFit="cover"
                                  objectPosition="center"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            ) : (
              <div className="relative h-[300px] w-[500px] my-4">
                <Image
                  src={auction.mainPhoto[0]}
                  alt={auction.name}
                  fill
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
            )}

            <p className="max-w-prose text-black/80">{auction.description}</p>
          </div>
          <div className="flex flex-col w-[400px] bg-red-500"></div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex">
          <div className="flex flex-col flex-1 mr-20">
            <AuctionLoader className="h-[450px]" />
          </div>
          <div className="flex flex-col w-[400px] bg-red-500"></div>
        </div>
      ) : null}

      {isError ? (
        <h2 className="text-center font-semibold text-red-500 text-lg md:text-2xl">
          An Error ocurred during auction load
        </h2>
      ) : null}
    </>
  );
};

export default AuctionDetailsPage;
