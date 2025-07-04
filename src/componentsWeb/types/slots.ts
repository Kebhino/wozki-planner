

export interface AddSlotProps {
  id: string;
  active: boolean
  data: string;
  from: number
  lokalizacjaId: string
}
export interface Slot {
  id: string;
  lokalizacja: string;
  active: boolean
  lokalizacjaId: string
  data: Date
  from: number
  to?: number
  suggestedTo?: number
}



export interface SortConfig {
  type: "slot" | "data" | "godzina"
  direction: "asc" | "desc";
}

