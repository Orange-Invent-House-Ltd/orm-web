/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { login } from "../index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      // Set auth token and show success message
      sessionStorage.setItem("token", data.data.token);
      toast.success(data.message);
      navigate("/");
    },
    onError: (error: any) => {
      const resMessage =
        error.response?.data?.message || "Login failed Please try again later";
      toast.error(resMessage);
    },
  });
};

//
// export const useFetchBanks = () => {
//     return useMutation({
//         mutationFn: fetchBanks,
//     });
// };

// export const useFetchStatements = () => {
//     return useMutation({
//         mutationFn: fetchStatements,
//     });
// };

// export const useSearchTransaction = () => {
//     return useMutation({
//         mutationFn: ({ user_id, account_number, account_holder_name, bank_name, transaction_reference_no, description, amount }: { user_id: number; account_number?: string; account_holder_name?: string; bank_name?: string; transaction_reference_no?: string; description?: string; amount?: string; }) =>
//             searchTransactions(user_id, account_number, account_holder_name, bank_name, transaction_reference_no, description, amount),
//         onSuccess: (data: any) => {
//             toast.success("Transactions fetched successfully");
//             console.log(data);
//         },
//         onError: (error: any) => {
//             const resMessage =
//                 error.response?.data?.message || "Failed to fetch transactions";
//             toast.error(resMessage);
//         },
//     });
// };
