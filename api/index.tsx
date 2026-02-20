/* eslint-disable @typescript-eslint/no-explicit-any */
import { privateApi, publicApi } from "./axios"


export const login = async (data: any) => {
  const res = await publicApi.post("/auth/login/orm", data);
  return res.data;
};

// fetchZenithAggregatedBalance
export const fetchZenithAggregatedBalance = async (params: {
     search?: string;
    start?: string;
    end?: string;
    account_number?: string;
    mode?: string;
    ordering?: string;
    size?: number;
    page?: number;
  } = {}) => {
  const res = await privateApi.get("/integrations/zenith-accounts", {
    params: params
  });
  return res.data;
}

  export const fetchZenithStatements = async (params: {
    search?: string;
    start?: string;
    end?: string;
    account_number?: string;
    mode?: string;
    ordering?: string;
    size?: number;
    page?: number;
  } = {}) => {
    const res = await privateApi.get("/integrations/zenith-accounts-statement", {
      params: params
    });
    return res.data;
};
  
// fetchUbaAggregatedBalance
export const fetchUbaAggregatedBalance = async (params: {
     search?: string;
    start?: string;
    end?: string;
    account_number?: string;
    mode?: string;
    ordering?: string;
    size?: number;
    page?: number;
  } = {}) => {
  const res = await privateApi.get("/integrations/uba-accounts");
  return res.data;
}

  export const fetchUbaStatements = async (params: {
     search?: string;
    start?: string;
    end?: string;
    account_number?: string;
    mode?: string;
    ordering?: string;
    size?: number;
    page?: number;
  } = {}) => {
    const res = await privateApi.get("/integrations/uba-accounts-statement", {
      params: params
    });
    return res.data;
};
  
// fetchPtbAggregatedBalance
export const fetchPtbAggregatedBalance = async (params: {
     search?: string;
    start?: string;
    end?: string;
    account_number?: string;
    mode?: string;
    ordering?: string;
    size?: number;
    page?: number;
  } = {}) => {
  const res = await privateApi.get("/integrations/ptb-accounts");
  return res.data;
}

  export const fetchPtbStatements = async (params: {
     search?: string;
    start?: string;
    end?: string;
    account_number?: string;
    mode?: string;
    ordering?: string;
    size?: number;
    page?: number;
  } = {}) => {
    const res = await privateApi.get("/integrations/ptb-accounts-statement", {
      params: params
    });
    return res.data;
  };

