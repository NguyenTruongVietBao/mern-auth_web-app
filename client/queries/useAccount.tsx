import {useQuery} from "@tanstack/react-query";
import account from "@/apiRequest/account";

export const useAccount = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: account.me
  })

}
