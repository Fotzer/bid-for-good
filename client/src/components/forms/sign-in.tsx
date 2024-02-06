"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CurrentPasswordValidator } from "@/lib/validators/auth";
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
import { ErrorCode, isErrorCode } from "@/types/auth-errors";

const ERROR_MESSAGES: Partial<Record<keyof typeof ErrorCode, string>> = {
  [ErrorCode.CREDENTIALS_NOT_FOUND]:
    "The email or password provided is incorrect",
  [ErrorCode.INCORRECT_EMAIL_PASSWORD]:
    "The email or password provided is incorrect",
};

export const SignInFormValidator = z.object({
  email: z.string().email().min(1),
  password: CurrentPasswordValidator,
});

export type TSignInFormValidator = z.infer<typeof SignInFormValidator>;

export type SignInFormProps = {
  className?: string;
};

export const SignInForm = ({ className }: SignInFormProps) => {
  const { toast } = useToast();

  const form = useForm<TSignInFormValidator>({
    values: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SignInFormValidator),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onFormSubmit = async ({ email, password }: TSignInFormValidator) => {
    try {
      const credentials: Record<string, string> = {
        email,
        password,
      };

      // sign in
      // let result;

      // if (result?.error && isErrorCode(result.error)) {
      //   const errorMessage = ERROR_MESSAGES[result.error];

      //   toast({
      //     variant: "destructive",
      //     title: "Unable to sign in",
      //     description: errorMessage ?? "An unknown error occurred",
      //   });

      //   return;
      // }
    } catch (err) {
      toast({
        title: "An unknown error occurred",
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
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};
