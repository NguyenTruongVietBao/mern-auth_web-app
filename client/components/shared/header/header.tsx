"use client";

import React from "react";
import { MenuItem } from "./menu-item";
import Link from "next/link";
import SearchHeader from "./search-header";
import { LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { UserAvatar } from "./user-avatar";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center px-5 shadow-sm">
      <Link href={"/"}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={100}
          height={50}
          objectFit="contain"
        />
      </Link>
      <div>
        <MenuItem />
      </div>
      <div className="flex gap-10">
        <div className="flex gap-2 items-center">
          <Search />
          <SearchHeader query={""} placeholder={"Search ..."} />
        </div>

        <div className="flex gap-2">
          {session ? (
            <div className="flex gap-2 items-center">
              <UserAvatar session={session} />
              <button
                onClick={() => signOut()}
                className="flex gap-2 items-center text-red-700"
              >
                <p className="mb-1">Logout</p>
                <LogOut />
              </button>
            </div>
          ) : (
            <>
              <Button variant={"default"}>
                <Link href={"/auth/login"}>Login</Link>
              </Button>
              <Button variant={"secondary"}>
                <Link href={"/auth/register"}>Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
