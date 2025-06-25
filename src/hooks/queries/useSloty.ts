import { useQuery } from "@tanstack/react-query";
import { getSlots } from "@/componentsWeb/api/sloty";
import type { Participant } from "@/componentsWeb/types/participants";

export const useSloty = () => {
  return useQuery<Participant[]>({
    queryKey: ["slots"],
    queryFn: ({ signal }) => getSlots(signal),
    staleTime: 1000 * 60 * 5,
  });
};