import type { AddLocationProps,  Lokalizacja } from "@/componentsWeb/types/lokalizacje";

export const addLocalization = async (payload: AddLocationProps) => {
  const res = await fetch("https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/lokalizacje", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Nie udało się dodać uczestnika");
  return res;
};

export const getLocalizations = async (signal?: AbortSignal) => {
  const res = await fetch("https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/lokalizacje", {signal});
  if (!res.ok) throw new Error("Błąd pobierania uczestników");
  const data = await res.json();
  return data.items;
};

export const updateLocalizationInDb = async (
  id: string,
  field: keyof Lokalizacja,
  value: string | boolean
) => {
  const res = await fetch(
    `https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/lokalizacje/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    }
  );
  if (!res.ok) throw new Error("Nie udało się zaktualizować uczestnika");
};

export const deleteLocalizationFromDb = async (id: string) => {
  const res = await fetch(
    `https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/lokalizacje/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) {
    throw new Error("Nie udało się usunąć uczestnika");
  }
};
