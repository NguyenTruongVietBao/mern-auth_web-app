'use client';

import {Button} from "@/components/ui/button";
import {useLogoutMutation} from "@/queries/useAuth";
import {useRouter} from "next/navigation";

export default function Dashboard() {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  async function onLogout() {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      localStorage.removeItem("accessToken");
      router.push('/login')
    } catch (e) {
      console.log('error', e);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant={'secondary'} onClick={onLogout}>
        Logout
      </Button>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    </div>
    );
}
