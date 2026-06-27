"use server";

import { redirect } from "next/navigation";

import { registerSchema, type RegisterInput } from "@/features/auth/schemas/register.schema";
import { hashPassword } from "@/server/auth/password";
import { prisma } from "@/server/db/prisma";

export interface RegisterActionResult {
  status: "error";
  message: string;
}

export const registerUser = async (
  input: RegisterInput,
): Promise<RegisterActionResult | never> => {
  const result = registerSchema.safeParse(input);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues[0]?.message ?? "Invalid registration details.",
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: result.data.email }, { username: result.data.username }],
    },
  });

  if (existingUser) {
    return {
      status: "error",
      message: "A user with that email or username already exists.",
    };
  }

  const passwordHash = await hashPassword(result.data.password);

  await prisma.user.create({
    data: {
      email: result.data.email,
      username: result.data.username,
      name: result.data.username,
      passwordHash,
    },
  });

  redirect("/login?registered=1");
};
