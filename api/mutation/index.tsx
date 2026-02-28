/* eslint-disable @typescript-eslint/no-explicit-any */
import { login, verify2fa } from "../index";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useLogin = () => {
  const navigate = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.data.token);
      toast.success(data.message);
      
      if (!data.data.is2faConfigured) {
        localStorage.setItem("qrCode", data.data.qrCode);
        localStorage.setItem("2faSecret", data.data["2faSecret"]);
        localStorage.setItem("sessionId", data.data.sessionId);
        return navigate.push("/security/enable-2fa");
      } else {
        localStorage.setItem("sessionId", data.data.sessionId);
        return navigate.push("/security/verify");

      }
    },
    onError: (error: any) => {
      const resMessage =
        error.response?.data?.message || "Login failed Please try again later";
      toast.error(resMessage);
    },
  });
};

export const useVerify2fa = () => {
  const navigate = useRouter();

  return useMutation({
    mutationFn: verify2fa,
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.data.token);
      toast.success(data.message);
      // return navigate.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
};