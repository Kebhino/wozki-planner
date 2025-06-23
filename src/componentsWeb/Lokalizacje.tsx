import {
  addLocalization,
  deleteLocalizationFromDb,
  getLocalizations,
  updateLocalizationInDb,
} from "@/componentsWeb/api/lokazlizacje";
import type {
  AddLocationProps,
  Lokalizacja,
  SortConfig,
} from "@/componentsWeb/types/lokalizacje";
import {
  Box,
  Button,
  Editable,
  HStack,
  IconButton,
  Input,
  CloseButton,
  Dialog,
  Portal,
  Table,
  useBreakpointValue,
  Text,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import type { ToastPosition } from "@chakra-ui/toast";
import { createStandaloneToast } from "@chakra-ui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Switch } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import SortableColumnHeader from "./SortowanieWKolumnie";
import { useGlobalDialogStore } from "./stores/useGlobalDialogStore";

const { ToastContainer, toast } = createStandaloneToast();

const Lokalizacje = () => {
  const queryClient = useQueryClient();
  const [uzytkownikDodawany, setUzytkownikDodawany] = useState(false);
  const { setIdDoUsuniecia, idDoUsuniecia, resetIdDoUsuniecia } =
    useGlobalDialogStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    type: "surname",
    direction: "asc",
  });

  const [mapaEdytowanychPol, setMapeEdytowanychPol] = useState<
    Map<string, string[]>
  >(new Map());

  const czyPoleJestZapisywane = (id: string, nazwaPola: string) => {
    const zapisywanePola = mapaEdytowanychPol.get(id);

    if (!zapisywanePola) return false;

    const czyZawieraPole = zapisywanePola.includes(nazwaPola);

    return czyZawieraPole; // da mi true albo false
  };

  const dodajPoleDoMapy = (id: string, nazwaPola: string) => {
    setMapeEdytowanychPol((prev) => {
      const nowaMapa = new Map(prev);

      const aktualnePola = nowaMapa.get(id) || [];

      if (!aktualnePola.includes(nazwaPola))
        nowaMapa.set(id, [...aktualnePola, nazwaPola]);

      return nowaMapa;
    });
  };

  const usunPoleZMapy = (id: string, nazwaPola: string) => {
    setMapeEdytowanychPol((prev) => {
      const nowaMapa = new Map(prev);

      const zaktualizowanaListaPol = (nowaMapa.get(id) || []).filter(
        (pole) => pole !== nazwaPola
      );

      if (zaktualizowanaListaPol.length > 0) {
        nowaMapa.set(id, zaktualizowanaListaPol);
      } else nowaMapa.delete(id);

      return nowaMapa;
    });
  };

  const position = useBreakpointValue({
    base: "top",
    lg: "bottom",
  }) as ToastPosition;
  const [newLocation, setNewLocation] = useState<Omit<Lokalizacja, "id">>({
    name: "",
    active: true,
  });

  const {
    data: lokalizacje = [],
    isLoading,
    isError,
    error,
  } = useQuery<Lokalizacja[]>({
    queryKey: ["lokalizacje"],
    queryFn: ({ signal }) => getLocalizations(signal),
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  if (isLoading) {
    return <p>Ładowanie lokalizacji...</p>;
  }

  if (isError) {
    return (
      <Box>
        <p>Błąd wczytywania danych: {(error as Error).message}</p>
      </Box>
    );
  }

  const sortedParticipants = [...lokalizacje].sort((a, b) => {
    const { type, direction } = sortConfig;

    const valA =
      type === "surname"
        ? a.name.split(" ").slice(-1)[0].toLowerCase()
        : a.active
        ? 1
        : 0;

    const valB =
      type === "surname"
        ? b.name.split(" ").slice(-1)[0].toLowerCase()
        : b.active
        ? 1
        : 0;

    return direction === "asc"
      ? valA > valB
        ? 1
        : valA < valB
        ? -1
        : 0
      : valA < valB
      ? 1
      : valA > valB
      ? -1
      : 0;
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

  const handleAddLocalization = async () => {
    if (typeof newLocation.name !== "string" || !newLocation.name.trim()) {
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

    const payload: AddLocationProps = {
      id: uuidv4(),
      active: newLocation.active,
      name: newLocation.name,
    };

    try {
      setUzytkownikDodawany(true);
      await addLocalization(payload); // 👈 WYWOŁANIE z api/participants.ts

      queryClient.invalidateQueries({ queryKey: ["lokalizacje"] });
      setNewLocation({ name: "", active: true });
      setUzytkownikDodawany(false);

      toast({
        title: "Dodano lokalizacje",
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

  const updateLocalization = async (
    id: string,
    field: keyof Lokalizacja,
    value: string | boolean
  ) => {
    try {
      await updateLocalizationInDb(id, field, value);
      await queryClient.invalidateQueries({ queryKey: ["lokalizacje"] });
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

  const deleteLocalization = async (id: string) => {
    try {
      await deleteLocalizationFromDb(id);
      await queryClient.invalidateQueries({ queryKey: ["lokalziacje"] });
      toast({
        title: "Lokalizacja usunięta",
        status: "info",
        duration: 3000,
        position,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Błąd usuwania lokalizacji",
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
          placeholder="Dane nowej lokalizacji"
          variant="subtle"
          bg="white"
          color="black"
          height={10}
          borderRadius={5}
          value={newLocation.name}
          onChange={(e) =>
            setNewLocation((prev) => ({
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

        <Button
          colorScheme="green"
          disabled={uzytkownikDodawany}
          onClick={handleAddLocalization}
          bg="white"
          color="black"
          height={10}
          fontSize={{ base: 8, md: 12, lg: 15 }}
          textAlign={"center"}
          borderRadius={10}
          _hover={{ bg: "green.400", color: "white" }}
        >
          {uzytkownikDodawany ? <Spinner /> : <IoMdAdd />}
        </Button>
      </HStack>

      {/* Tabela */}
      <Table.Root width="100%" mt={3} color={"black"} interactive>
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
          {sortedParticipants.map((l) => (
            <Table.Row key={l.id}>
              <Table.Cell>
                {!czyPoleJestZapisywane(l.id, "name") ? (
                  <Editable.Root
                    defaultValue={l.name}
                    submitMode={"enter"}
                    disabled={czyPoleJestZapisywane(l.id, "name")}
                    opacity={czyPoleJestZapisywane(l.id, "name") ? 0.4 : 1}
                    onValueCommit={(val) => {
                      dodajPoleDoMapy(l.id, "name");

                      updateLocalization(l.id, "name", val.value)
                        .then(() => toast({ title: "Zmieniono imię" }))
                        .finally(() => usunPoleZMapy(l.id, "name"));
                    }}
                  >
                    <Editable.Preview />
                    <Stack direction={{ base: "column", md: "row" }}>
                      <Editable.Input />
                      <Editable.Control>
                        <Editable.EditTrigger asChild>
                          <IconButton
                            variant="ghost"
                            size="xs"
                            borderRadius={"full"}
                            _hover={{
                              bg: "green.500",
                            }}
                          >
                            <LuPencilLine />
                          </IconButton>
                        </Editable.EditTrigger>
                        <Editable.CancelTrigger asChild>
                          <IconButton
                            variant="outline"
                            size={{ base: "2xs", md: "sm", lg: "sm" }}
                            color={"red.600"}
                            borderRadius={10}
                          >
                            <LuX />
                          </IconButton>
                        </Editable.CancelTrigger>
                        <Editable.SubmitTrigger asChild>
                          <IconButton
                            variant="outline"
                            size={{ base: "2xs", md: "sm", lg: "sm" }}
                            color={"green.500"}
                            borderRadius={10}
                          >
                            <LuCheck />
                          </IconButton>
                        </Editable.SubmitTrigger>
                      </Editable.Control>
                    </Stack>
                  </Editable.Root>
                ) : (
                  <Spinner />
                )}
              </Table.Cell>
              <Table.Cell>
                <HStack>
                  {!czyPoleJestZapisywane(l.id, "active") ? (
                    <Switch.Root
                      ml={5}
                      colorPalette={"green"}
                      checked={l.active}
                      size={{ base: "xs", md: "sm", lg: "md" }}
                    >
                      <Switch.HiddenInput
                        onChange={(e) => {
                          dodajPoleDoMapy(l.id, "active");
                          updateLocalization(l.id, "active", e.target.checked)
                            .then(() =>
                              toast({
                                title: e.target.checked
                                  ? "Lokalizacja aktywny"
                                  : "Lokalizacja nieaktywny",
                              })
                            )
                            .finally(() => usunPoleZMapy(l.id, "active"));
                        }}
                      />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Switch.Label />
                    </Switch.Root>
                  ) : (
                    <Spinner ml={7} />
                  )}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Dialog.Root role="alertdialog" open={idDoUsuniecia === l.id}>
                  <Dialog.Trigger asChild>
                    {!czyPoleJestZapisywane(l.id, "usun") ? (
                      <Button
                        size="md"
                        mr={2}
                        borderRadius={5}
                        disabled={
                          czyPoleJestZapisywane(l.id, "name") ||
                          czyPoleJestZapisywane(l.id, "active") ||
                          czyPoleJestZapisywane(l.id, "status")
                        }
                        color={"red.600"}
                        bg={"white"}
                        _hover={{ bg: "red", color: "white" }}
                        transition="all 0.2s"
                        _active={{ transform: "scale(0.95)", bg: "red.600" }}
                        onClick={() => {
                          dodajPoleDoMapy(l.id, "usun");
                          setIdDoUsuniecia(l.id);
                        }}
                      >
                        <MdOutlineDeleteForever />
                      </Button>
                    ) : (
                      <Spinner mr={6} size={"md"} />
                    )}
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>Jesteś pewien?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          Czy jesteś pewien, że chcesz usunąć lokalizacje:{" "}
                          <Text fontWeight={"bold"} textAlign={"center"} mt={5}>
                            {l.name}
                          </Text>
                          {l.active && (
                            <Text textAlign="center" color="red" pt={5}>
                              <b>{l.name}</b> jest oznaczony jako aktywny
                            </Text>
                          )}
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => {
                                resetIdDoUsuniecia();
                                usunPoleZMapy(l.id, "usun");
                              }}
                            >
                              Nie
                            </Button>
                          </Dialog.ActionTrigger>
                          <Button
                            colorPalette="red"
                            onClick={() => {
                              resetIdDoUsuniecia();
                              deleteLocalization(l.id).finally(() =>
                                usunPoleZMapy(l.id, "usun")
                              );
                            }}
                          >
                            Tak
                          </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton
                            size="md"
                            onClick={() => {
                              resetIdDoUsuniecia();
                              usunPoleZMapy(l.id, "usun");
                            }}
                          />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default Lokalizacje;
