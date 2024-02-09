"use client";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants/file-upload";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { IAuction } from "@/types/auction";

export const NewAuctionFormValidator = z.object({
  name: z.string().trim().min(1, { message: "Please enter a valid name" }),
  description: z
    .string()
    .min(10, {
      message: "Please enter a description at least 10 characters long",
    })
    .max(
      500,
      "Please enter a description with length less than 500 characters"
    ),
  mainPhoto: z
    .any()
    .refine((file) => {
      if (file instanceof FileList) {
        return Array.from(file).every((file) => file?.size <= MAX_FILE_SIZE);
      } else {
        return file?.size <= MAX_FILE_SIZE;
      }
    }, `Max image size is 5MB.`)
    .refine((file) => {
      if (file instanceof FileList) {
        return Array.from(file).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file?.type)
        );
      } else {
        return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      }
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
  startPrice: z
    .number()
    .min(0, "Price should be larger than 0")
    .max(2147483647, "Price should be lower than 2147483647")
    .optional(),
});

export const UpdateAuctionFormValidator = z.object({
  name: z.string().trim().min(1, { message: "Please enter a valid name" }),
  description: z
    .string()
    .min(10, {
      message: "Please enter a description at least 10 characters long",
    })
    .max(
      500,
      "Please enter a description with length less than 500 characters"
    ),
  mainPhoto: z
    .any()
    .refine((file) => {
      if (!file) return true;
      if (file instanceof FileList) {
        return Array.from(file).every((file) => file?.size <= MAX_FILE_SIZE);
      } else {
        return file?.size <= MAX_FILE_SIZE;
      }
    }, `Max image size is 5MB.`)
    .refine((file) => {
      if (!file) return true;
      if (file instanceof FileList) {
        return Array.from(file).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file?.type)
        );
      } else {
        return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      }
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),
  startPrice: z
    .number()
    .min(0, "Price should be larger than 0")
    .max(2147483647, "Price should be lower than 2147483647")
    .optional(),
});

export type TNewAuctionFormValidator = z.infer<typeof NewAuctionFormValidator>;

export type AuctionFormProps = {
  className?: string;
  auction?: IAuction;
};

const AuctionForm = ({ className, auction }: AuctionFormProps) => {
  const { toast } = useToast();
  const { token } = useAuth();

  const queryClient = useQueryClient();
  const router = useRouter();

  const isUpdating = !!auction;

  const { mutate: createAuction } = useMutation({
    mutationFn: async (auctionDto: TNewAuctionFormValidator) => {
      console.log(auctionDto);
      const data = new FormData();

      for (const key in auctionDto) {
        if (key === "photos") {
          // @ts-ignore
          (Array.isArray(auctionDto["photos"])
            ? // @ts-ignore
              auctionDto["photos"]
            : // @ts-ignore
              [auctionDto["photos"]]
          ).forEach(function (image, i) {
            data.append("image_" + i, image);
          });
        } else {
          // @ts-ignore
          data.append(key, auctionDto[key]);
        }
      }

      if (isUpdating) {
        return axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auctions/${auction.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        return axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auctions`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
    },
    onSuccess: () => {
      toast({
        title: `Auction ${
          isUpdating ? "updated" : "created"
        } successfully updated`,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      if (isUpdating) {
        router.push("/auctions/" + auction.id);
      } else {
        router.push("/auctions");
      }
    },
    onError: () => {
      toast({
        title: "An unknown error occurred",
        variant: "destructive",
        description: `We encountered an unknown error while attempting to ${
          isUpdating ? "update" : "create"
        } your auction. Please try again later.`,
      });
    },
  });

  console.log(auction);

  const form = useForm<TNewAuctionFormValidator>({
    values: isUpdating
      ? { ...auction, mainPhoto: null }
      : {
          name: "",
          description: "",
          mainPhoto: "",
        },
    resolver: zodResolver(
      isUpdating ? UpdateAuctionFormValidator : NewAuctionFormValidator
    ),
    reValidateMode: "onChange",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onFormSubmit = async ({
    name,
    description,
    mainPhoto,
    startPrice,
  }: TNewAuctionFormValidator) => {
    const photos =
      mainPhoto instanceof FileList ? Array.from(mainPhoto) : mainPhoto;

    if (!photos) {
      createAuction({ name, description, startPrice });
      return;
    }

    const auctionDtoObj = {
      name,
      description,
      photos,
      startPrice,
    };

    createAuction(auctionDtoObj);
  };

  return (
    <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-semibold">
        {isUpdating ? "Update Auction" : "New Auction"}
      </h1>
      <Form {...form}>
        <form
          className={cn("flex w-full flex-col gap-y-4", className)}
          onSubmit={form.handleSubmit(onFormSubmit)}
        >
          <fieldset
            className="flex w-full flex-col gap-y-4"
            disabled={isSubmitting}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startPrice"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>StartPrice</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      onChange={(e) =>
                        onChange(isNaN(+e.target.value) ? 0 : +e.target.value)
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainPhoto"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Image File</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        id="picture"
                        type="file"
                        multiple
                        onChange={(e) => {
                          const file =
                            e.target.files?.length === 1
                              ? e.target.files![0]
                              : e.target.files;
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>

          <Button type="submit" size="lg" loading={isSubmitting}>
            {isSubmitting
              ? `${isUpdating ? "Updating" : "Creating"} auction...`
              : `${isUpdating ? "Update" : "Create"} auction`}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuctionForm;
