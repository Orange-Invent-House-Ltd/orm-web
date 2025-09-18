import { useQuery } from "@tanstack/react-query";
import { fetchAggregatedBalance, getBankImages } from "..";

// export const useFetchBanks = () => {
//   return useQuery({
//     queryFn: fetchBanks,
//     queryKey: ["banks"],
//     enabled: true
//   });
// };

export const useFetchBankImages = () => {
  return useQuery({
    queryFn: getBankImages,
    queryKey: ["bankImages"],
    enabled: true
  });
};

// use agreegated balance
export const useFetchAggregatedBalance = () => {
  return useQuery({
    queryFn: () => fetchAggregatedBalance(),
    queryKey: ["aggregatedBalance"],
  });
}
