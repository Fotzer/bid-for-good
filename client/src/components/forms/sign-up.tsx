"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PasswordValidator } from "@/lib/validators/auth";
import { cn } from "@/lib/utils";
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
import { PasswordInput } from "../ui/password-input";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/providers/auth";

export const SignUpFormValidator = z
  .object({
    name: z.string().trim().min(1, { message: "Please enter a valid name." }),
    email: z.string().email().min(1),
    password: PasswordValidator,
  })
  .refine(
    (data) => {
      const { name, email, password } = data;
      return (
        !password.includes(name) && !password.includes(email.split("@")[0])
      );
    },
    {
      message: "Password should not be common or based on personal information",
    }
  );

export type TSignUpFormValidator = z.infer<typeof SignUpFormValidator>;

export type SignUpFormProps = {
  className?: string;
};

export const SignUpForm = ({ className }: SignUpFormProps) => {
  const { toast } = useToast();
  const { signUp } = useAuth();

  const form = useForm<TSignUpFormValidator>({
    values: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(SignUpFormValidator),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onFormSubmit = async ({
    name,
    email,
    password,
  }: TSignUpFormValidator) => {
    try {
      const user = await signUp!({ name, email, password });

      if (user) {
        toast({
          title: "Signed up successfully",
          description: "Enjoy our services",
        });
      } else {
        toast({
          title: "An unknown error occurred",
          description:
            "We encountered an unknown error while attempting to sign you up. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "An unknown error occurred",
        description:
          "We encountered an unknown error while attempting to sign you up. Please try again later.",
        variant: "destructive",
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          className="dark:bg-documenso dark:hover:opacity-90"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};
