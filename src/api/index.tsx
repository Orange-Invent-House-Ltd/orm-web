/* eslint-disable @typescript-eslint/no-explicit-any */
import { privateApi, publicApi } from "./axios"


export const login = async (data: any) => {
  const res = await publicApi.post("/auth/login", data);
  return res.data;
};

export const fetchBanks = async (data: any) => {
  const res = await privateApi.post("/integrations/zenith/account-balance", data);
  return res.data;
};

// fetchAggregatedBalance
export const fetchAggregatedBalance = async () => {
  const res = await privateApi.get("/integrations/zenith/aggregated-balance");
  return res.data;
}

// export const fetchStatements = async (search: any, start: any, end: any, account_number: any,) => {
//   const res = await privateApi.get("/integrations/zenith-accounts-statement",
//     {
//       params: { search, start, end, account_number }
//     }
//   );
//   return res.data;
// };
export const fetchStatements = async (params: {
  search?: string;
  start?: string;
  end?: string;
  account_number?: string;
  size?: number;
  page?: number;
} = {}) => {
  const res = await privateApi.get("/integrations/zenith-accounts-statement", {
    params: params
  });
  return res.data;
};

// export const searchTransactions = async (user_id: number, account_number?: string, account_holder_name?: string, bank_name?: string, transaction_reference_no?: string, description?: string, amount?: string) => {
//   const res = await privateApi.post(`/search_all.php`, { user_id, account_number, account_holder_name, bank_name, transaction_reference_no, description, amount });
//   return res.data;
// };

// export const getBankImages = async () => {
//   const res = await privateApi.get(`all_banks.php`);
//   return res.data.data;
// };