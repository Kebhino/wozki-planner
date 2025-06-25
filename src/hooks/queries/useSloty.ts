import { getSlots } from "@/componentsWeb/api/sloty";
import type { Slot } from "@/componentsWeb/types/slots";
import { useQuery } from "@tanstack/react-query";

export const useSloty = () => {
  return useQuery<Slot[]>({
    queryKey: ["sloty"],
    queryFn: ({ signal }) => getSlots(signal),
    staleTime: 1000 * 60 * 5,
  });
};