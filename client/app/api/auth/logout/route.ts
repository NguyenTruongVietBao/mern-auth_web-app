import { cookies } from "next/headers";
import auth from "@/apiRequest/auth";
import { HttpError } from "@/lib/http";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  // TODO: Đang code cứng chưa fix
  const accessToken = cookieStore.get("accessToken")?.value;
  const accessTokenFromLocalStorage = getAccessTokenFromLocalStorage() || "";

  console.log("refreshToken from next server", refreshToken);
  console.log("accessToken from next server", accessToken);
  console.log(
    "accessTokenFromLocalStorage from next server",
    accessTokenFromLocalStorage
  );

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        success: false,
        message: "Không tìm thấy accessToken or refreshToken",
      },
      { status: 401 }
    );
  }
  try {
    const result = await auth.sLogout({
      refreshToken,
      accessToken: accessToken || accessTokenFromLocalStorage,
    });
    console.log("Result at Next Server: ", result);
    return Response.json(result.payload);
  } catch (error) {
    if (error instanceof HttpError) {
      console.log("ERROR at Next Server: ", error);
      return Response.json(error);
    } else {
      console.log("Something went wrong: ", error);
      return Response.json(
        {
          success: false,
          message: "Internal server error",
        },
        { status: 500 }
      );
    }
  }
}
