import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchPtbAggregatedBalance, fetchPtbStatements, fetchUbaAggregatedBalance, fetchUbaStatements, fetchZenithAggregatedBalance, fetchZenithStatements, } from "..";

type StatementParams = {
  search?: string
  start?: string
  end?: string
  account_number?: string
  size?: number
  page?: number
}
// 
type ExtraOptions = Omit<UseQueryOptions, 'queryKey' | 'queryFn'>
// use agreegated balance
export const useFetchZenithAggregatedBalance = (
  params?: {
  search?: string;
  start?: string;
  end?: string;
  account_number?: string;
  size?: number;
  page?: number;
}
) => {
  return useQuery({
    queryFn: () => fetchZenithAggregatedBalance(params),
    queryKey: ["zenithAggregatedBalance", params],
  });
}


// use agreegated balance
export const useFetchUbaAggregatedBalance = (params?: {
  search?: string;
  start?: string;
  end?: string;
  account_number?: string;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryFn: () => fetchUbaAggregatedBalance(params),
    queryKey: ["ubaAggregatedBalance", params],
  });
}


// use agreegated balance
export const useFetchPtbAggregatedBalance = (
  params?: {
  search?: string;
  start?: string;
  end?: string;
  account_number?: string;
  size?: number;
  page?: number;
}
) => {
  return useQuery({
    queryFn: () => fetchPtbAggregatedBalance(params),
    queryKey: ["ptbAggregatedBalance", params],
  });
}




export const useFetchZenithStatements = (
  params?: StatementParams,
  options?: ExtraOptions
) => {
  return useQuery({
    queryFn: () => fetchZenithStatements(params),
    queryKey: ['zenithStatements', params],
    ...options,   // ← spreads in `enabled`, `staleTime`, etc.
  })
}

export const useFetchUbaStatements = (
  params?: StatementParams,
  options?: ExtraOptions
) => {
  return useQuery({
    queryFn: () => fetchUbaStatements(params),
    queryKey: ['ubaStatements', params],
    ...options,
  })
}

export const useFetchPtbStatements = (
  params?: StatementParams,
  options?: ExtraOptions
) => {
  return useQuery({
    queryFn: () => fetchPtbStatements(params),
    queryKey: ['ptbStatements', params],
    ...options,
  })
}