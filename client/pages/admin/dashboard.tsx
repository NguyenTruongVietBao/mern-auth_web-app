
import {cookies} from "next/headers";
import accountApiRequest from "@/apiRequest/account";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value!
  let name = ''
  try {
    const res = await accountApiRequest.sMe(accessToken)
    console.log('res', res)
    name = (res.payload as any).data.name
  } catch (e: any) {
    if(e.digest?.includes('NEXT_REDIRECT')) {
      throw e
    }
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard {name}</h1>
    </div>
  );
}
