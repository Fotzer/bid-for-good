import { IBet } from "@/types/bet";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { formatRelativeTime } from "@/lib/utils";

const BetsHistory = ({ bets }: { bets: IBet[] | undefined }) => {
  return (
    <div className="mt-6">
      <h4 className="text-3xl font-semibold">Bet History</h4>

      {bets ? (
        <div className="space-y-2.5 mt-3">
          {bets.slice(0, 5).map((bet) => (
            <div key={bet.id} className="flex justify-between">
              <div>
                <div className="flex gap-2 items-center">
                  <h4 className="font-semibold">{bet.user.name}</h4>
                  <p className="text-sm">{formatRelativeTime(bet.createdAt)}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {bet.user.email}
                </p>
              </div>

              <p>{bet.betValue}$</p>
            </div>
          ))}
        </div>
      ) : null}

      {bets && bets?.length > 5 ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-3">
            <AccordionTrigger>View the rest of the bets</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2.5">
                {bets.slice(5).map((bet) => (
                  <div key={bet.id} className="flex justify-between">
                    <div>
                      <div className="flex gap-2 items-center">
                        <h4 className="font-semibold">{bet.user.name}</h4>
                        <p className="text-sm">
                          {formatRelativeTime(bet.createdAt)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bet.user.email}
                      </p>
                    </div>

                    <p>{bet.betValue}$</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </div>
  );
};

export default BetsHistory;
