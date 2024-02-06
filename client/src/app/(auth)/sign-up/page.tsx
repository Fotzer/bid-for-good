import { SignUpForm } from "@/components/forms/sign-up";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Create a new account</h1>

      <p className="text-muted-foreground/60 mt-2 text-sm">
        Create your account and start using our services
      </p>

      <SignUpForm className="mt-4" />

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary duration-200 hover:opacity-70"
        >
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
