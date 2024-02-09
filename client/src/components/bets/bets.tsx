"use client";

import { IBet } from "@/types/bet";
import axios from "axios";
import { Fragment, useMemo } from "react";
import { useQuery } from "react-query";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import BetCreator from "./bet-creator";
import BetsHistory from "./bets-history";

const Bets = ({ auctionId }: { auctionId: string }) => {
  const {
    data: bets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [auctionId, "bets"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auctions/${auctionId}/bets/history`
      );

      return res.data as IBet[];
    },
  });

  console.log(bets);

  const users = useMemo(() => {
    const users: {
      user: IBet["user"];
      maxBet: number;
    }[] = [];

    bets?.forEach((bet) => {
      const user = users.find(
        (userInfo) => userInfo.user.email === bet.user.email
      );
      if (!user) {
        users.push({
          user: bet.user,
          maxBet: bet.betValue,
        });
      } else if (user.maxBet < bet.betValue) {
        user.maxBet = bet.betValue;
      }
    });

    users.sort((a, b) => (a.maxBet < b.maxBet ? 1 : -1));
    return users;
  }, [bets]);

  console.log(users);

  return (
    <div>
      <h3 className="text-3xl font-semibold">Bets</h3>

      {users.length > 0 ? (
        <Card className="mt-3">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">User Rating:</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {users.map((userInfo, i) => (
              <Fragment key={userInfo.user.email}>
                <div key={userInfo.user.email} className="flex justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-full h-5 w-5 text-xs text-white l p-1 bg-blue-500 leading-none grid place-content-center">
                      {i + 1}
                    </div>
                    <div>
                      <h4>{userInfo.user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {userInfo.user.email}
                      </p>
                    </div>
                  </div>

                  <Badge className="bg-black hover:bg-black/80 self-start">
                    {userInfo.maxBet} $
                  </Badge>
                </div>

                {i !== users.length - 1 ? <Separator /> : null}
              </Fragment>
            ))}
          </CardContent>
        </Card>
      ) : (
        <p className="mt-2 text-muted-foreground">
          No Bets for this auction yet
        </p>
      )}

      {users.length > 0 ? <BetsHistory bets={bets} /> : null}

      <BetCreator auctionId={auctionId} />
    </div>
  );
};

export default Bets;
