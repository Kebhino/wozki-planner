import type { AddParticipantProps, Participant } from "@/componentsWeb/types/participants";

export const addParticipant = async (payload: AddParticipantProps) => {
  const res = await fetch("https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/participants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Nie udało się dodać uczestnika");
  return res;
};

export const getParticipants = async () => {
  const res = await fetch("https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/participants");
  if (!res.ok) throw new Error("Błąd pobierania uczestników");
  const data = await res.json();
  return data.items;
};

export const updateParticipantInDb = async (
  id: string,
  field: keyof Participant,
  value: string
) => {
  const res = await fetch(
    `https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/participants/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    }
  );
  if (!res.ok) throw new Error("Nie udało się zaktualizować uczestnika");
};

export const deleteParticipantFromDb = async (id: string) => {
  const res = await fetch(
    `https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/participants/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) {
    throw new Error("Nie udało się usunąć uczestnika");
  }
};
