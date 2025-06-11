export type Status = "Pionier Stały" | "Pionier Pomocniczy" | "Głosiciel";

export interface AddParticipantProps {
  id: string;
  name: string;
  status: Status;
}

