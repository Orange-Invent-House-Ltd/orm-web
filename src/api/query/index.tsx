import { useQuery } from "@tanstack/react-query";
import { fetchAggregatedBalance, fetchStatements, } from "..";

// export const useFetchBanks = () => {
//   return useQuery({
//     queryFn: fetchBanks,
//     queryKey: ["banks"],
//     enabled: true
//   });
// };

// export const useFetchBankImages = () => {
//   return useQuery({
//     queryFn: getBankImages,
//     queryKey: ["bankImages"],
//     enabled: true
//   });
// };

// use agreegated balance
export const useFetchAggregatedBalance = () => {
  return useQuery({
    queryFn: () => fetchAggregatedBalance(),
    queryKey: ["aggregatedBalance"],
  });
}
// // use fetch statements
// export const useFetchStatements = (search?: any, start?: any, end?: any, account_number?: any) => {
//   return useQuery({
//     queryFn: () => fetchStatements(search, start, end, account_number,),
//     queryKey: ["statements", search, start, end, account_number],
//   });
// }
export const useFetchStatements = (params?: {
  search?: string;
  start?: string;
  end?: string;
  account_number?: string;
}) => {
  return useQuery({
    queryFn: () => fetchStatements(params),
    queryKey: ["statements", params],
  });
}