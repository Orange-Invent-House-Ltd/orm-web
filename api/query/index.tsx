import { useQuery } from "@tanstack/react-query";
import { fetchAggregatedBalance, fetchStatements, } from "..";


// use agreegated balance
export const useFetchAggregatedBalance = () => {
  return useQuery({
    queryFn: () => fetchAggregatedBalance(),
    queryKey: ["aggregatedBalance"],
  });
}

export const useFetchStatements = (params?: {
  search?: string;
  start?: string;
  end?: string;
  account_number?: string;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryFn: () => fetchStatements(params),
    queryKey: ["statements", params],
  });
}