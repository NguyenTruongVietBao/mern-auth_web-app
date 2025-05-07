"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter } from "next/navigation";
import { LayoutDashboardIcon, LogOut, Settings, User } from "lucide-react";

export function UserAvatar({ data }: { data: any }) {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  async function onLogout() {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      router.push("/login");
    } catch (e) {
      console.log("error", e);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className={"cursor-pointer"}>
          <AvatarImage
            src={
              data?.user?.image ??
              "https://img.lovepik.com/png/20231014/Colorful-brown-squinted-laughing-cartoon-face-clipart-face-clipart-avatar_206278_wh1200.png"
            }
            alt="User Avatar"
          />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className={"flex items-center gap-2"}>
          <User size={18} />
          <Link href={"/profile"}>Profile</Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={"flex items-center gap-2"}>
          <LayoutDashboardIcon />
          <Link href={"/dashboard"}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className={"flex items-center gap-2"}>
          <Settings />
          <Link href={"/settings"}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className={
            "font-medium text-red-700 flex items-center gap-2 cursor-pointer"
          }
        >
          <LogOut className={"font-medium text-red-700"} />
          <p className={"mb-1"}>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
