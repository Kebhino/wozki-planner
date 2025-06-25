

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
  data: string
}



export interface SortConfig {
  type: "surname" | "status";
  direction: "asc" | "desc";
}
