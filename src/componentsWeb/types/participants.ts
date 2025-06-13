export type Status = "Pionier St." | "Pionier Pom." | "Głosiciel";

export interface AddParticipantProps {
  id: string;
  name: string;
  active: boolean
  status: Status;
}

export interface Participant {
  id: string;
  name: string;
  active: boolean
  status: Status;
}

export interface SortConfig {
  type: "surname" | "status";
  direction: "asc" | "desc";
}
