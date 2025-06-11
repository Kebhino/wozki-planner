// src/api/participants.ts
import type { AddParticipantProps } from "@/componentsWeb/types/participants";

export const addParticipant = async (payload: AddParticipantProps) => {
  const res = await fetch("https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com//participants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Nie udało się dodać uczestnika");
  return res;
};
