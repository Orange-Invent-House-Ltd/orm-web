/* eslint-disable @typescript-eslint/no-explicit-any */
import { login } from "../index";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useLogin = () => {
  const navigate = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      // Set auth token and show success message
      sessionStorage.setItem("token", data.data.token);
      toast.success(data.message);
      navigate.push("/banks/zenith");
    },
    onError: (error: any) => {
      const resMessage =
        error.response?.data?.message || "Login failed Please try again later";
      toast.error(resMessage);
    },
  });
};

