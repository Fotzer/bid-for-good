import { z } from "zod";

export const CurrentPasswordValidator = z
  .string()
  .min(6, { message: "Must be at least 6 characters in length" })
  .max(72);

export const PasswordValidator = z
  .string()
  .regex(new RegExp(".*[A-Z].*"), { message: "One uppercase character" })
  .regex(new RegExp(".*[a-z].*"), { message: "One lowercase character" })
  .regex(new RegExp(".*\\d.*"), { message: "One number" })
  .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), {
    message: "One special character is required",
  })
  .min(8, { message: "Must be at least 8 characters in length" })
  .max(72, { message: "Cannot be more than 72 characters in length" });

export const SignUpMutationValidator = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: PasswordValidator,
});

export type TSignUpMutationValidator = z.infer<typeof SignUpMutationValidator>;
