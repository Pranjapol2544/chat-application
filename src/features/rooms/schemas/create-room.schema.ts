import { z } from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(2, "Room name must be at least 2 characters.")
    .max(50, "Room name must be at most 50 characters."),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
