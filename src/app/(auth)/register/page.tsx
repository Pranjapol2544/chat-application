import { redirect } from "next/navigation";

import { RegisterForm } from "@/features/auth/components/register-form";
import { getOptionalSession } from "@/server/auth/session";

export default async function RegisterPage() {
  const session = await getOptionalSession();

  if (session?.user?.id) {
    redirect("/rooms");
  }

  return <RegisterForm />;
}
