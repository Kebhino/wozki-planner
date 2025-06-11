import { Box, Button, Editable, HStack, Input, Table } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/toast";
import { useState } from "react";
import { addParticipant } from "@/componentsWeb/api/participants";
import { v4 as uuidv4 } from "uuid";
const StyledSelect = chakra("select");
const { ToastContainer, toast } = createStandaloneToast();
import type {
  AddParticipantProps,
  Status,
} from "@/componentsWeb/types/participants";

interface Participant {
  id: string;
  name: string;
  status: Status;
}

const statusOptions: Status[] = [
  "Pionier Stały",
  "Pionier Pomocniczy",
  "Głosiciel",
];

const TablicaUczestnikow = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState<Omit<Participant, "id">>(
    {
      name: "",
      status: "Głosiciel",
    }
  );

  const handleAddParticipant = async () => {
    if (!newParticipant.name.trim()) {
      toast({
        title: "Podaj imię i nazwisko",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload: AddParticipantProps = {
      id: uuidv4(),
      name: newParticipant.name,
      status: newParticipant.status,
    };

    try {
      await addParticipant(payload); // 👈 WYWOŁANIE z api/participants.ts

      setParticipants((prev) => [...prev, payload]);
      setNewParticipant({ name: "", status: "Głosiciel" });

      toast({
        title: "Dodano uczestnika",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Błąd połączenia z API",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  const updateParticipant = (
    id: string,
    field: keyof Participant,
    value: string
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        if (field === "name") {
          return { ...p, name: value };
        }

        if (field === "status") {
          return { ...p, status: value as Status }; // jeśli kiedyś będziesz edytować status
        }

        // jeśli ktoś próbowałby zmienić id — ignorujemy
        return p;
      })
    );
  };

  const deleteParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Usunięto uczestnika",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box pt={4}>
      <ToastContainer />

      {/* Formularz */}
      <HStack gap={2}>
        <Input
          placeholder="Dane nowego uczestnika"
          variant="subtle"
          bg="white"
          color="black"
          height={10}
          borderRadius={5}
          value={newParticipant.name}
          onChange={(e) =>
            setNewParticipant((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />

        <StyledSelect
          value={newParticipant.status}
          bg="white"
          color="black"
          height={10}
          textAlign={"center"}
          borderRadius={5}
          onChange={(e) =>
            setNewParticipant((prev) => ({
              ...prev,
              status: e.target.value as Status,
            }))
          }
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </StyledSelect>

        <Button
          colorScheme="green"
          onClick={handleAddParticipant}
          bg="white"
          color="black"
          height={10}
          textAlign={"center"}
          borderRadius={10}
          _hover={{ bg: "green.400", color: "white" }}
        >
          ADD
        </Button>
      </HStack>

      {/* Tabela */}
      <Table.Root width="100%" mt={3} color={"black"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader fontWeight={"bold"}>
              Imię i nazwisko
            </Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Akcje</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {participants.map((p) => (
            <Table.Row key={p.id}>
              <Table.Cell>
                <Editable.Root
                  value={p.name}
                  onValueChange={(val) =>
                    updateParticipant(p.id, "name", val.value)
                  }
                >
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
              </Table.Cell>
              <Table.Cell>
                <StyledSelect
                  value={p.status}
                  onChange={(e) =>
                    updateParticipant(p.id, "status", e.target.value)
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </StyledSelect>
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  borderRadius={5}
                  bg={"red"}
                  onClick={() => deleteParticipant(p.id)}
                  _hover={{ bg: "red", color: "white" }}
                  transition="all 0.2s"
                  _active={{ transform: "scale(0.95)", bg: "red.600" }}
                >
                  DELETE
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default TablicaUczestnikow;
