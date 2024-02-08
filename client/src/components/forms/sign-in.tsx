"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { CurrentPasswordValidator } from "@/lib/validators/auth";
import { useAuth } from "@/providers/auth";
import { IUserSignIn } from "@/types/user";
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

  const { login } = useAuth();

  const isSubmitting = form.formState.isSubmitting;

  const onFormSubmit = async ({ email, password }: TSignInFormValidator) => {
    const credentials: IUserSignIn = {
      email,
      password,
    };

    let user = await login!(credentials);

    if (!user) {
      toast({
        variant: "destructive",
        title: "Unable to sign in",
        description: "An unknown error occurred",
      });

      return;
    } else {
      toast({
        variant: "default",
        title: "Signed in",
        description: "Welcome back to our application",
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
