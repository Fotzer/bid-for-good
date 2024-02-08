"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth";
import axios from "axios";
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
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

export const ZProfileFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter a valid name." }),
});

export type TProfileFormSchema = z.infer<typeof ZProfileFormSchema>;

export type ProfileFormProps = {
  className?: string;
};

export const ProfileForm = ({ className }: ProfileFormProps) => {
  const router = useRouter();
  const { token, user, updateUserName } = useAuth();

  const { toast } = useToast();

  const form = useForm<TProfileFormSchema>({
    values: {
      name: user?.name ?? "",
    },
    resolver: zodResolver(ZProfileFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onFormSubmit = async ({ name }: TProfileFormSchema) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/name`,
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        duration: 5000,
      });

      updateUserName!(name);

      router.refresh();
    } catch (err) {
      toast({
        title: "An unknown error occurred",
        variant: "destructive",
        description:
          "We encountered an unknown error while attempting to sign you In. Please try again later.",
      });
    }
  };

  return (
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
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="bg-muted mt-2"
              value={user?.email ?? ""}
              disabled
            />
          </div>
        </fieldset>

        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Updating profile..." : "Update profile"}
        </Button>
      </form>
    </Form>
  );
};
