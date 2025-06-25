import type {
  AddSlotProps,
  Slot,
  SortConfig,
} from "@/componentsWeb/types/slots";
import { useLokalizacje } from "@/hooks/queries/useLokalizacje";
import { useSloty } from "@/hooks/queries/useSloty";
import {
  Box,
  Button,
  chakra,
  CloseButton,
  Dialog,
  HStack,
  Portal,
  Spinner,
  Switch,
  Table,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { ToastPosition } from "@chakra-ui/toast";
import { createStandaloneToast } from "@chakra-ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { pl } from "date-fns/locale";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { addSlot, deleteSlotFromDb, updateSlotInDb } from "./api/sloty";
import SortableColumnHeader from "./SortowanieSloty";
import { useGlobalDialogStore } from "./stores/useGlobalDialogStore";

const StyledSelect = chakra("select");
const { ToastContainer, toast } = createStandaloneToast();
registerLocale("pl", pl);
const dostepneGodziny = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const Sloty = () => {
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
      console.log(nowaMapa);

      return nowaMapa;
    });
  };

  const position = useBreakpointValue({
    base: "top",
    lg: "bottom",
  }) as ToastPosition;
  const [newSlot, setNewSlot] = useState<Omit<Slot, "id">>({
    name: "",
    data: new Date(),
    active: true,
    from: 0,
  });

  const lokalizacjeQuery = useLokalizacje();
  const lokalizacjeData = lokalizacjeQuery.data || [];

  const slotsQuery = useSloty();
  const slots = slotsQuery.data || [];
  console.log(slots);

  const sortedParticipants = [...slots].sort((a, b) => {
    const { type, direction } = sortConfig;

    let valA: string | number;
    let valB: string | number;

    if (type === "surname") {
      valA = a.name.split(" ").slice(-1)[0].toLowerCase();
      valB = b.name.split(" ").slice(-1)[0].toLowerCase();
      return direction === "asc"
        ? valA.localeCompare(valB, "pl")
        : valB.localeCompare(valA, "pl");
    } else if (type === "data") {
      const timeA = a.data.getTime(); // liczba milisekund
      const timeB = b.data.getTime();

      return direction === "asc" ? timeA - timeB : timeB - timeA;
    }

    return 0;
  });

  const handleSortChange = (type: "surname" | "data") => {
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

  const handleAddSlot = async () => {
    if (typeof newSlot.name !== "string" || !newSlot.name.trim()) {
      toast({
        title: "Wybierz Slot",
        status: "warning",
        duration: 3000,
        position,
        isClosable: true,
        variant: "subtle",
      });
      return;
    }

    const payload: AddSlotProps = {
      id: uuidv4(),
      active: newSlot.active,
      name: newSlot.name,
      data: newSlot.data.toLocaleDateString(),
      from: newSlot.from,
    };

    try {
      setUzytkownikDodawany(true);
      await addSlot(payload);

      queryClient.invalidateQueries({ queryKey: ["sloty"] });
      setNewSlot({ name: "", data: new Date(), active: true, from: 0 });
      setUzytkownikDodawany(false);

      toast({
        title: "Dodano Slot",
        description: `${newSlot.name} w dniu ${newSlot.data.toLocaleDateString(
          "pl-PL",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        )} godzina: ${newSlot.from}`,
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

  const updateSlot = async (
    id: string,
    field: keyof Slot,
    value: string | boolean
  ) => {
    try {
      await updateSlotInDb(id, field, value);
      await queryClient.invalidateQueries({ queryKey: ["sloty"] });
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

  const deleteSlot = async (id: string) => {
    try {
      await deleteSlotFromDb(id);
      toast({
        title: "Slot usunięty",
        status: "info",
        duration: 3000,
        position,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["sloty"] });
    } catch (error) {
      toast({
        title: "Błąd usuwania slota",
        status: "error",
        duration: 3000,
        position,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const isMobile = window.innerWidth < 768; // funkcja pomocnicza zeby ogarnac responsywnosc selektorów

  return (
    <Box pt={4}>
      {slotsQuery.isLoading && <p>Ładowanie slotów...</p>}
      {slotsQuery.error && (
        <p>Błąd wczytywania danych: {(slotsQuery.error as Error).message}</p>
      )}
      <ToastContainer />
      {/* Formularz */}
      <HStack gap={2}>
        {/* <Input
          placeholder="Dodaj nowy slot"
          variant="subtle"
          bg="white"
          color="black"
          height={10}
          borderRadius={5}
          value={newSlot.name}
          onChange={(e) =>
            setNewSlot((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        /> */}
        <StyledSelect
          value={newSlot.name}
          bg="white"
          color="black"
          fontSize={{ base: 12, md: 14, lg: 16 }}
          height={10}
          textAlign={"center"}
          borderRadius={5}
          p={2}
          onChange={(e) =>
            setNewSlot((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        >
          <option value="" disabled hidden>
            {lokalizacjeQuery.isLoading
              ? isMobile
                ? "Ładowanie..."
                : "Ładowanie lokalizacji..."
              : isMobile
              ? "Lokalizacja"
              : "Wybierz lokalizację"}
          </option>

          {lokalizacjeData
            .filter((lokalizacja) => lokalizacja.active)
            .map((lokalizacja) => (
              <option key={lokalizacja.name} value={lokalizacja.name}>
                {lokalizacja.name}
              </option>
            ))}
        </StyledSelect>
        <DatePicker
          selected={newSlot.data}
          locale="pl"
          dateFormat="dd.MM.yyyy"
          onChange={(date) => {
            if (date) {
              setNewSlot((prev) => ({
                ...prev,
                data: date,
              }));
            }
          }}
          className="custom-datepicker"
        />
        📅
        <StyledSelect
          value={newSlot.from === 0 ? "" : newSlot.from}
          bg="white"
          color="black"
          fontSize={{ base: 12, md: 14, lg: 16 }}
          height={10}
          textAlign={"center"}
          borderRadius={5}
          px={5}
          onChange={(e) => {
            setNewSlot((prev) => ({
              ...prev,
              from: parseInt(e.target.value),
            }));
          }}
        >
          <option value="" disabled hidden>
            {slotsQuery.isLoading
              ? isMobile
                ? "Ładowanie..."
                : "Ładowanie godzin"
              : isMobile
              ? "Godzina"
              : "Wybierz godzinę"}
          </option>

          {dostepneGodziny.map((godzina, index) => (
            <option key={index} value={godzina}>
              {godzina}
            </option>
          ))}
        </StyledSelect>
        <Button
          colorScheme="green"
          disabled={uzytkownikDodawany}
          onClick={handleAddSlot}
          bg="green.400"
          color="white"
          height={10}
          fontSize={{ base: 8, md: 12, lg: 15 }}
          textAlign={"center"}
          borderRadius={10}
          _hover={{ bg: "green.300", color: "white" }}
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
                label="Sloty"
                sortKey="surname"
                currentSort={sortConfig.type}
                sortAsc={sortConfig.direction === "asc"}
                onSortChange={handleSortChange}
              />
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <SortableColumnHeader
                label="Data"
                sortKey="data"
                currentSort={sortConfig.type}
                sortAsc={sortConfig.direction === "asc"}
                onSortChange={handleSortChange}
              />
            </Table.ColumnHeader>
            <Table.ColumnHeader>Aktywny</Table.ColumnHeader>
            <Table.ColumnHeader>Godziny</Table.ColumnHeader>
            <Table.ColumnHeader>Akcje</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedParticipants.map((p) => (
            <Table.Row key={p.id}>
              <Table.Cell>
                {!czyPoleJestZapisywane(p.id, "name") ? (
                  <StyledSelect
                    value={p.name}
                    fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                    onChange={(e) => {
                      dodajPoleDoMapy(p.id, "name");
                      updateSlot(p.id, "name", e.target.value)
                        .then(() =>
                          toast({
                            description: (
                              <Text>
                                Zmieniono lokalizacje na:{" "}
                                <Text
                                  as="span"
                                  fontWeight="bold"
                                  display="inline"
                                >
                                  {e.target.value}
                                </Text>
                              </Text>
                            ),
                          })
                        )
                        .finally(() => usunPoleZMapy(p.id, "name"));
                    }}
                  >
                    {lokalizacjeData.map((lokalizacja) => (
                      <option key={lokalizacja.name} value={lokalizacja.name}>
                        {lokalizacja.name}
                      </option>
                    ))}
                  </StyledSelect>
                ) : (
                  <Spinner ml={5} />
                )}
              </Table.Cell>
              {/* <Table.Cell>
                {!czyPoleJestZapisywane(p.id, "name") ? (
                  <Editable.Root
                    defaultValue={p.name}
                    submitMode={"enter"}
                    disabled={czyPoleJestZapisywane(p.id, "name")}
                    opacity={czyPoleJestZapisywane(p.id, "name") ? 0.4 : 1}
                    onValueCommit={(val) => {
                      dodajPoleDoMapy(p.id, "name");

                      updateSlot(p.id, "name", val.value)
                        .then(() => toast({ title: "Zmieniono imię" }))
                        .finally(() => usunPoleZMapy(p.id, "name"));
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
                )} */}
              {/* </Table.Cell> */}
              <Table.Cell>
                <HStack>
                  <Text fontSize="sm">
                    {new Date(p.data).toLocaleDateString("pl-PL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Text>
                </HStack>
              </Table.Cell>
              <Table.Cell>
                {!czyPoleJestZapisywane(p.id, "active") ? (
                  <Switch.Root
                    ml={5}
                    colorPalette={"green"}
                    checked={p.active}
                    size={{ base: "xs", md: "sm", lg: "md" }}
                  >
                    <Switch.HiddenInput
                      onChange={(e) => {
                        dodajPoleDoMapy(p.id, "active");
                        updateSlot(p.id, "active", e.target.checked)
                          .then(() =>
                            toast({
                              title: e.target.checked
                                ? "Uczestnik aktywny"
                                : "Uczestnik nieaktywny",
                            })
                          )
                          .finally(() => usunPoleZMapy(p.id, "active"));
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
              </Table.Cell>
              <Table.Cell>
                <Text>
                  {p.from}:00 - {p.from + 1}:00
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Dialog.Root role="alertdialog" open={idDoUsuniecia === p.id}>
                  <Dialog.Trigger asChild>
                    {!czyPoleJestZapisywane(p.id, "usun") ? (
                      <Button
                        size="md"
                        mr={2}
                        borderRadius={5}
                        disabled={
                          czyPoleJestZapisywane(p.id, "name") ||
                          czyPoleJestZapisywane(p.id, "active") ||
                          czyPoleJestZapisywane(p.id, "status")
                        }
                        color={"red.600"}
                        bg={"white"}
                        _hover={{ bg: "red", color: "white" }}
                        transition="all 0.2s"
                        _active={{ transform: "scale(0.95)", bg: "red.600" }}
                        onClick={() => {
                          dodajPoleDoMapy(p.id, "usun");
                          setIdDoUsuniecia(p.id);
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
                          Czy jesteś pewien, że chcesz usunąć uczestnika:{" "}
                          <Text fontWeight={"bold"} textAlign={"center"} mt={5}>
                            {p.name}
                          </Text>
                          {p.active && (
                            <Text textAlign="center" color="red" pt={5}>
                              <b>{p.name}</b> jest oznaczony jako aktywny
                            </Text>
                          )}
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => {
                                resetIdDoUsuniecia();
                                usunPoleZMapy(p.id, "usun");
                              }}
                            >
                              Nie
                            </Button>
                          </Dialog.ActionTrigger>
                          <Button
                            colorPalette="red"
                            onClick={() => {
                              resetIdDoUsuniecia();
                              deleteSlot(p.id).finally(() =>
                                usunPoleZMapy(p.id, "usun")
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
                              usunPoleZMapy(p.id, "usun");
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

export default Sloty;
