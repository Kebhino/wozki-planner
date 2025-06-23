export interface Lokalizacja {
  id: string;
  name: string;
  active: boolean
  
}

export interface AddLocationProps {
  id: string;
  name: string;
  active: boolean
  
}

export interface SortConfig {
  type: "surname" | "status";
  direction: "asc" | "desc";
}