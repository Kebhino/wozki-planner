import {
  addParticipant,
  deleteParticipantFromDb,
  getParticipants,
  updateParticipantInDb,
} from "@/componentsWeb/api/participants";
import type {
  AddParticipantProps,
  Participant,
  SortConfig,
  Status,
} from "@/componentsWeb/types/participants";
import {
  Box,
  Button,
  chakra,
  Editable,
  HStack,
  Input,
  Table,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { ToastPosition } from "@chakra-ui/toast";
import { createStandaloneToast } from "@chakra-ui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SortableColumnHeader from "./SortowanieWKolumnie";
const StyledSelect = chakra("select");
const { ToastContainer, toast } = createStandaloneToast();

const statusOptions: Status[] = [
  "Pionier Stały",
  "Pionier Pomocniczy",
  "Głosiciel",
];

const TablicaUczestnikow = () => {
  const queryClient = useQueryClient();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    type: "surname",
    direction: "asc",
  });
  const position = useBreakpointValue({
    base: "top",
    lg: "bottom",
  }) as ToastPosition;
  const [newParticipant, setNewParticipant] = useState<Omit<Participant, "id">>(
    {
      name: "",
      status: "Głosiciel",
    }
  );

  const {
    data: participants = [],
    isLoading,
    isError,
    error,
  } = useQuery<Participant[]>({
    queryKey: ["participants"],
    queryFn: getParticipants,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  if (isLoading) {
    return <p>Ładowanie danych uczestników...</p>;
  }

  if (isError) {
    return (
      <Box>
        <p>Błąd wczytywania danych: {(error as Error).message}</p>
      </Box>
    );
  }

  const sortedParticipants = [...participants].sort((a, b) => {
    const { type, direction } = sortConfig;

    const valA =
      type === "surname"
        ? a.name.split(" ").slice(-1)[0].toLowerCase()
        : a.status.toLowerCase();

    const valB =
      type === "surname"
        ? b.name.split(" ").slice(-1)[0].toLowerCase()
        : b.status.toLowerCase();

    return direction === "asc"
      ? valA.localeCompare(valB, "pl")
      : valB.localeCompare(valA, "pl");
  });

  const handleSortChange = (type: "surname" | "status") => {
    setSortConfig((prev) => {
      if (prev.type === type) {
        // Jeśli kliniemy w tą samą kolumne to zmieni się kierunek sortowania
        return {
          ...prev,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        // Jeśli klikniemy inną kolumne to przełączamy się na nią i ustawiany domyślny kierunek
        return {
          type,
          direction: "asc",
        };
      }
    });
  };

  const handleAddParticipant = async () => {
    if (
      typeof newParticipant.name !== "string" ||
      !newParticipant.name.trim()
    ) {
      toast({
        title: "Podaj imię i nazwisko",
        status: "warning",
        duration: 3000,
        position,
        isClosable: true,
        variant: "subtle",
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

      queryClient.invalidateQueries({ queryKey: ["participants"] });
      setNewParticipant({ name: "", status: "Głosiciel" });

      toast({
        title: "Dodano uczestnika",
        status: "success",
        duration: 4000,
        isClosable: true,
        position,
        variant: "subtle",
      });
    } catch (err) {
      toast({
        title: "Błąd połączenia z API",
        status: "error",
        duration: 3000,
        isClosable: true,
        position,
        variant: "subtle",
      });
      console.error(err);
    }
  };

  const updateParticipant = async (
    id: string,
    field: keyof Participant,
    value: string
  ) => {
    try {
      await updateParticipantInDb(id, field, value);
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    } catch (error) {
      toast({
        title: "Błąd aktualizacji",
        status: "error",
        duration: 3000,
        position,
        isClosable: true,
        variant: "subtle",
      });
    }
  };

  const deleteParticipant = async (id: string) => {
    try {
      await deleteParticipantFromDb(id);
      toast({
        title: "Uczestnik usunięty",
        status: "info",
        duration: 3000,
        position,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    } catch (error) {
      toast({
        title: "Błąd usuwania uczestnika",
        status: "error",
        duration: 3000,
        position,
        isClosable: true,
      });
      console.error(error);
    }
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
        {/* <SortMenu
          sortType={sortType}
          sortAsc={sortAsc}
          setSortType={setSortType}
          setSortAsc={setSortAsc}
        /> */}

        <StyledSelect
          value={newParticipant.status}
          bg="white"
          color="black"
          fontSize={{ base: 8, md: 12, lg: 15 }}
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
          fontSize={{ base: 8, md: 12, lg: 15 }}
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
              <SortableColumnHeader
                label="Imię i nazwisko"
                sortKey="surname"
                currentSort={sortConfig.type}
                sortAsc={sortConfig.direction === "asc"}
                onSortChange={handleSortChange}
              />
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <SortableColumnHeader
                label="Status"
                sortKey="status"
                currentSort={sortConfig.type}
                sortAsc={sortConfig.direction === "asc"}
                onSortChange={handleSortChange}
              />
            </Table.ColumnHeader>
            <Table.ColumnHeader>Akcje</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedParticipants.map((p) => (
            <Table.Row key={p.id}>
              <Table.Cell>
                <Editable.Root
                  defaultValue={p.name}
                  onValueCommit={(val) => {
                    console.log(val);
                    updateParticipant(p.id, "name", val.value);
                  }}
                  submitMode="enter"
                >
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
              </Table.Cell>
              <Table.Cell>
                <StyledSelect
                  defaultValue={p.status}
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
