"use client";

import type { Session } from "next-auth";
import Image from "next/image";

export function UserAvatar({ session }: { session: Session | null }) {
  return (
    <div>
      <Image
        width={40}
        height={40}
        className="rounded-full"
        src={
          session?.user?.image ??
          "https://img.lovepik.com/png/20231014/Colorful-brown-squinted-laughing-cartoon-face-clipart-face-clipart-avatar_206278_wh1200.png"
        }
        alt="User Avatar"
      />
    </div>
  );
}
