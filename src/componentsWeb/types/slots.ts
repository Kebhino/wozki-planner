

export interface AddSlotProps {
  id: string;
  name: string;
  active: boolean
  data: string;
}







export interface Slot {
  id: string;
  name: string;
  active: boolean
  data: Date
}



export interface SortConfig {
  type: "surname" | "data";
  direction: "asc" | "desc";
}
