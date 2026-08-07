import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  aggregatedBalances,
  fetchInstitutionAccounts,
  fetchInstitutionAccountStatements,
  fetchInstitutions,
} from "..";

type StatementParams = {
  search?: string;
  start?: string;
  end?: string;
  account_number?: string;
  mode?: string;
  ordering?: string;
  size?: number;
  page?: number;
};

type ExtraOptions = Omit<UseQueryOptions, "queryKey" | "queryFn">;

export function useAggregatedBalances() {
  return useQuery({
    queryFn: aggregatedBalances,
    queryKey: ["aggregatedBalances"],
  });
}

export const useFetchInstitutionAccounts = (
  params?: {
    bank_name?: string;
    is_mda_account?: boolean;
    search?: string;
    start?: string;
    end?: string;
    account_number?: string;
    size?: number;
    page?: number;
  },
  options?: ExtraOptions,
) => {
  return useQuery({
    queryFn: () => fetchInstitutionAccounts(params),
    queryKey: ["institutionAccounts", params],
    ...options,
  });
};

export const useFetchInstitutionAccountStatements = (
  params?: StatementParams & { bank_name?: string },
  options?: ExtraOptions,
) => {
  return useQuery({
    queryFn: () => fetchInstitutionAccountStatements(params),
    queryKey: ["institutionAccountStatements", params],
    ...options,
  });
};

export const useFetchInstitutions = () => {
  return useQuery({
    queryFn: fetchInstitutions,
    queryKey: ["institutions"],
  });
};
