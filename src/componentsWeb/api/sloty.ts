import type { AddSlotProps } from "@/componentsWeb/types/slots";
import type { Slot } from "../types/slots";

export const addSlot = async (payload: AddSlotProps) => {
  const res = await fetch("https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/sloty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Nie udało się dodać slota");
  return res;
};

export const getSlots = async (signal?: AbortSignal) => {
  const res = await fetch("https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/sloty", {signal});
  if (!res.ok) throw new Error("Błąd pobierania slotów");
  const data = await res.json();
  console.log("🐞 Surowe dane slotów:", data.items);
  return data.items.map((item: any) => {
    console.log("➡️ Otrzymany item.data:", item.data); // ⬅️ TU 👈

    return {
      id: item.id,
      name: item.name,
      active: item.active,
      from: Number(item.from),
      data: item.data ? new Date(item.data) : null,
    };
  });
};

export const updateSlotInDb = async (
  id: string,
  field: keyof Slot,
  value: string | boolean
) => {
  const res = await fetch(
    `https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/sloty/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    }
  );
  if (!res.ok) throw new Error("Nie udało się zaktualizować slota");
};

export const deleteSlotFromDb = async (id: string) => {
  const res = await fetch(
    `https://gngp5xd4ol.execute-api.eu-central-1.amazonaws.com/sloty/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) {
    throw new Error("Nie udało się usunąć slota");
  }
};
