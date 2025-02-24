import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().email().min(1),
  password: z.string().min(6),
});
export const contentSchema = z.object({
  link: z.string().url(),
  title: z.string().min(1),
});
