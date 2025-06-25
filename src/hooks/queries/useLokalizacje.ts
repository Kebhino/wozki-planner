import { getLocalizations } from "@/componentsWeb/api/lokazlizacje";
import type { Lokalizacja } from "@/componentsWeb/types/lokalizacje";
import { useQuery } from "@tanstack/react-query";


export const useLokalizacje = () => {
  return useQuery<Lokalizacja[]>({
    queryKey: ["lokalizacje"],
    queryFn: ({ signal }) => getLocalizations(signal),
    staleTime: 1000 * 60 * 5,
  });
};