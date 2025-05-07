import http from "@/lib/http";

const accountApiRequest = {
  me: () => http.get("/api/auth/me"),
  sMe: (accessToken: string) => http.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}
export default accountApiRequest;