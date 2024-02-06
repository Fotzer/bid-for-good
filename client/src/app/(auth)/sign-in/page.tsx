import type { Metadata } from "next";
import Link from "next/link";

import { SignInForm } from "@/components/forms/sign-in";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Sign in to your account</h1>

      <p className="text-muted-foreground/60 mt-2 text-sm">
        Welcome back, we are lucky to have you.
      </p>

      <SignInForm className="mt-4" />

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-primary duration-200 hover:opacity-70"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
