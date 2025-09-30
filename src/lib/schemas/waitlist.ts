import { z } from "zod";

export const waitlistSchema = z.object({
  email: z
    .string()
    .min(1, "Work email is required")
    .email("Enter a valid work email"),
});

export type WaitlistPayload = z.infer<typeof waitlistSchema>;
