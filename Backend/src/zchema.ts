import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().email().min(3),
  password: z.string().min(8).max(20),
});
export const contentSchema = z.object({
  link: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["image", "video", "article", "audio", "tweet"]),
  tags: z.array(z.string().optional()),
});
export const tagSchema = z.object({
  title: z.string().min(1),
});

export const linkSchema = z.object({
  hash: z.string().min(1),
  userId: z.string().min(1),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1),
  sessionId: z.string().min(1),
});
