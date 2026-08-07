import { privateApi, publicApi } from "./axios";

export const login = async (data: any) => {
  const res = await publicApi.post("/auth/login/2fa/initialize", data);
  return res.data;
};
export const verify2fa = async (data: any) => {
  const res = await publicApi.post("/auth/login/2fa/finalize", data);
  return res.data;
};

export async function aggregatedBalances() {
  const res = await privateApi.get("/integrations/aggregated-balance");
  return res.data;
}

export const fetchInstitutionAccounts = async (
  params: {
    bank_name?: string;
    is_mda_account?: boolean;
    search?: string;
    start?: string;
    end?: string;
    account_number?: string;
    mode?: string;
    ordering?: string;
    size?: number;
    page?: number;
  } = {},
) => {
  const res = await privateApi.get("/integrations/institution-accounts", {
    params: params,
  });
  return res.data;
};

export const fetchInstitutionAccountStatements = async (
  params: {
    bank_name?: string;
    account_number?: string;
    search?: string;
    start?: string;
    end?: string;
    mode?: string;
    ordering?: string;
    size?: number;
    page?: number;
  } = {},
) => {
  const res = await privateApi.get("/integrations/institution-accounts-statement", {
    params: params,
  });
  return res.data;
};

export const fetchInstitutions = async () => {
  const res = await privateApi.get("/integrations/institutions");
  return res.data;
};
