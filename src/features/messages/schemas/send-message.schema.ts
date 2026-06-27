import { z } from "zod";

export const sendMessageSchema = z.object({
  roomId: z.string().min(1, "Room id is required."),
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(500, "Message must be at most 500 characters."),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
