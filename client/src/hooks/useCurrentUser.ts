import { useQuery } from "@tanstack/react-query";
import { validateUser, ValidateUserResponse } from "../api/authApi";

interface UseCurrentUserResult {
  user: ValidateUserResponse | undefined;
  status: "idle" | "loading" | "error" | "success" | "pending";
}

function useCurrentUser(): UseCurrentUserResult {
  const { data, status } = useQuery<ValidateUserResponse>({
    queryKey: ["current-user"],
    queryFn: validateUser,
  });

  return { user: data, status };
}

export default useCurrentUser;
