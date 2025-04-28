"use client";

import React from "react";
import { MenuItem } from "./menu-item";
import Link from "next/link";
import SearchHeader from "./search-header";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Header() {

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
      <div>
        <MenuItem />
      </div>

      <div className="flex gap-2 items-center">
        <Search />
        <SearchHeader query={""} placeholder={"Search ..."} />
      </div>

      <div className="flex gap-2 items-center">
          <Button variant={"default"}>
              <Link href={"/login"}>Login</Link>
          </Button>
          <Button variant={"secondary"}>
              <Link href={"/register"}>Register</Link>
          </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
