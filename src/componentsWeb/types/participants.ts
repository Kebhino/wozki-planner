export type Status = "Pionier Stały" | "Pionier Pomocniczy" | "Głosiciel";

export interface AddParticipantProps {
  id: string;
  name: string;
  status: Status;
}

export interface Participant {
  id: string;
  name: string;
  status: Status;
}

export interface SortConfig {
  type: "surname" | "status";
  direction: "asc" | "desc";
}
