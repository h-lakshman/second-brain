import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().email().min(3),
  password: z.string().min(8).max(20),
});
export const contentSchema = z.object({
  link: z.string().url(),
  title: z.string().min(1),
  type: z.enum(["image", "video", "article", "audio"]),
  tags: z.array(z.string()),
});
export const tagSchema = z.object({
  title: z.string().min(1),
});

export const linkSchema = z.object({
  hash: z.string().min(1),
  userId: z.string().min(1),
});

