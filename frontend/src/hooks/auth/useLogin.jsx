import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../../data-access/index";

/* 
   REGISTER HOOK
 */

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

/* 
   LOGIN HOOK
 */

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      // optional cache update
      queryClient.setQueryData(["me"], data.user);
    },
  });
};

/* 
   LOGOUT HOOK
 */

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      queryClient.removeQueries(["me"]);
    },
  });
};

/* 
   GET CURRENT USER HOOK
 */

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,

    retry: false,
    refetchOnWindowFocus: false,
  });
};
