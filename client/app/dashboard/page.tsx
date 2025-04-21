"use client";

import { UserAvatar } from "@/components/shared/header/user-avatar";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log("session", session);
  return (
    <nav>
      {JSON.stringify(session, null, 4)}
      <UserAvatar session={session} />
    </nav>
  );
}
