"use client";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Loader, Send } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useAuth } from "@/providers/auth";
import { toast } from "../ui/use-toast";

const BetCreator = ({
  auctionId,
  minValue,
}: {
  auctionId: string;
  minValue: number;
}) => {
  const NewBetValidator = z.object({
    betValue: z
      .number()
      .min(minValue, `Bet should be larger than ${minValue}`)
      .max(2147483647, "Bet should be lower than 2147483647"),
  });

  type TNewBetValidator = z.infer<typeof NewBetValidator>;

  const form = useForm<TNewBetValidator>({
    values: {
      betValue: 0,
    },
    resolver: zodResolver(NewBetValidator),
    reValidateMode: "onChange",
  });

  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: createAuction, isLoading } = useMutation({
    mutationFn: async (betDto: TNewBetValidator) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auctions/${auctionId}/bets`,
        betDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast({
        title: `Bet created successfully updated`,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: [auctionId, "bets"] });
    },
    onError: () => {
      toast({
        title: "An unknown error occurred",
        variant: "destructive",
        description: `We encountered an unknown error while attempting to create your bet. Please try again later.`,
      });
    },
  });

  const onFormSubmit = async ({ betValue }: TNewBetValidator) => {
    createAuction({ betValue });
    form.reset();
  };

  return (
    <div className="mt-6">
      <h4 className="text-3xl font-semibold">Make a bet</h4>
      <Form {...form}>
        <form
          className={cn("flex w-full flex-col gap-y-4 mt-2")}
          onSubmit={form.handleSubmit(onFormSubmit)}
        >
          <fieldset
            className="flex w-full flex-col gap-y-4"
            disabled={isLoading}
          >
            <FormField
              control={form.control}
              name="betValue"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex">
                      <Input
                        onChange={(e) =>
                          onChange(isNaN(+e.target.value) ? 0 : +e.target.value)
                        }
                        type="text"
                        {...field}
                      />
                      <Button type="submit" size="lg" loading={isLoading}>
                        {!isLoading && <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default BetCreator;
