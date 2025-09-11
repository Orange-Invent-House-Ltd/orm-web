/* eslint-disable @typescript-eslint/no-explicit-any */
import { privateApi, publicApi } from "./axios"


export const login = async (data: any) => {
  const res = await publicApi.post("/index.php", data);
  return res.data;
};

export const fetchBanks = async (data: any) => {
  const res = await privateApi.post("/shared/zenith/account-balance/", data);
  return res.data;
};
export const fetchStatements = async (data: any) => {
  const res = await privateApi.post("/shared/zenith/statement-by-transdt/", data);
  return res.data;
};

export const searchTransactions = async (user_id: number, account_number?: string, account_holder_name?: string, bank_name?: string, transaction_reference_no?: string, description?: string, amount?: string) => {
  const res = await privateApi.post(`/search_all.php`, { user_id, account_number, account_holder_name, bank_name, transaction_reference_no, description, amount });
  return res.data;
};

export const getBankImages = async () => {
  const res = await privateApi.get(`all_banks.php`);
  return res.data.data;
};