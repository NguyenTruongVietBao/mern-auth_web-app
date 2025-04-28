import {cookies} from "next/headers";
import authApiRequest from "@/apiRequest/authApiRequest";

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  console.log('refreshToken', refreshToken);
  cookieStore.delete('refreshToken')
  try {
    const result = await authApiRequest.sLogout()
    console.log('result', result);
    return Response.json(result)
  } catch (error) {
    return Response.json({
      status: 500,
      message: 'Error when call api logout to Backend'
    });
  }
}