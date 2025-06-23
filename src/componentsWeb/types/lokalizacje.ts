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
  type: "lokalizacja" | "status";
  direction: "asc" | "desc";
}