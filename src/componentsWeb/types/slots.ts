

export interface AddSlotProps {
  id: string;
  name: string;
  active: boolean
  data: string;
  from: number
}
export interface Slot {
  id: string;
  name: string;
  active: boolean
  data: Date
  from: number
  to?: number
  suggestedTo?: number
}



export interface SortConfig {
  type: "slot" | "data" | "godzina"
  direction: "asc" | "desc";
}

