"use client";

import React, {useEffect, useState} from "react";
import { MenuItem } from "./menu-item";
import Link from "next/link";
import SearchHeader from "./search-header";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {getAccessTokenFromLocalStorage} from "@/lib/utils";
import {useLogoutMutation} from "@/queries/useAuth";
import {useRouter} from "next/navigation";
import {UserAvatar} from "@/components/shared/header/user-avatar";

export default function Header() {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
  }, []);

  async function onLogout() {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      router.push('/login')
    } catch (e) {
      console.log('error', e);
    }
  }

  return (
    <div className="flex justify-between items-center px-5 shadow-sm">
      <Link href={"/"}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="object-contain"
          priority
        />
      </Link>

      {isAuth ? (
        <>
          <div>
            <MenuItem />
          </div>
          <div className={'flex items-center gap-10'}>
            <div className="flex gap-2 items-center">
              <Search />
              <SearchHeader query={""} placeholder={"Search ..."} />
            </div>
            <div className={'flex items-center gap-3'}>
              <UserAvatar data={null}/>
              <Button variant={'secondary'} onClick={onLogout}>
                Logout
              </Button>
              <ThemeToggle />
            </div>
          </div>

        </>
      ) : (
        <div className="flex gap-2 items-center">
          <Button variant={"default"}>
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button variant={"secondary"}>
            <Link href={"/register"}>Register</Link>
          </Button>
          <ThemeToggle />
        </div>
      )}
    </div>
  );
}
