import type { Slot, SortConfig } from "@/componentsWeb/types/slots";
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
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { addSlot, deleteSlotFromDb, updateSlotInDb } from "./api/sloty";
import SortableColumnHeader from "./SortowanieSloty";
import { useEdytowanePolaMapa } from "./stores/useEdytowanePolaMapa";
import { useGlobalDialogStore } from "./stores/useGlobalDialogStore";
const StyledSelect = chakra("select");

const { ToastContainer, toast } = createStandaloneToast();
registerLocale("pl", pl);
const dostepneGodzinyOd = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const dostepneGodzinyDo = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const Sloty = () => {
  const queryClient = useQueryClient();
  const [uzytkownikDodawany, setUzytkownikDodawany] = useState(false);
  const { setIdDoUsuniecia, idDoUsuniecia, resetIdDoUsuniecia } =
    useGlobalDialogStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    type: "data",
    direction: "asc",
  });

  const { dodajPoleDoMapy, sprawdzCzyEdytowane, usunPoleZMapy } =
    useEdytowanePolaMapa();

  const position = useBreakpointValue({
    base: "top",
    lg: "bottom",
  }) as ToastPosition;
  const [newSlot, setNewSlot] = useState<Omit<Slot, "id">>({
    name: "",
    data: new Date(),
    active: true,
    from: 0,
    to: undefined,
    suggestedTo: undefined,
  });

  const lokalizacjeQuery = useLokalizacje();
  const lokalizacjeData = lokalizacjeQuery.data || [];

  const slotsQuery = useSloty();
  const slots = slotsQuery.data || [];

  const sortedParticipants = [...slots].sort((a, b) => {
    const { type, direction } = sortConfig;

    let valA: string | number;
    let valB: string | number;

    if (type === "slot") {
      valA = a.name;
      valB = b.name;
      return direction === "asc"
        ? valA.localeCompare(valB, "pl")
        : valB.localeCompare(valA, "pl");
    }
    if (type === "data") {
      const timeA = a.data.getTime(); // liczba milisekund
      const timeB = b.data.getTime();

      return direction === "asc" ? timeA - timeB : timeB - timeA;
    }

    if (type === "godzina") {
      const timeA = a.from;
      const timeB = b.from;

      return direction === "asc" ? timeA - timeB : timeB - timeA;
    }

    return 0;
  });

  const handleSortChange = (type: "slot" | "data" | "godzina") => {
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
    if (
      typeof newSlot.name !== "string" ||
      !newSlot.name.trim() ||
      newSlot.from === 0
    ) {
      toast({
        title:
          (typeof newSlot.name !== "string" || !newSlot.name.trim()) &&
          newSlot.from === 0
            ? "Wybierz lokalizację i godzinę"
            : typeof newSlot.name !== "string" || !newSlot.name.trim()
            ? "Wybierz lokalizację"
            : "Wybierz godzinę",
        status: "warning",
        duration: 3000,
        position,
        isClosable: true,
        variant: "subtle",
      });
      return;
    }

    const ileSlotowDodac = () => {
      if (newSlot.to) return newSlot.to - newSlot.from;
      return 1;
    };

    try {
      setUzytkownikDodawany(true);
      for (let i = 0; i < ileSlotowDodac(); i++) {
        await addSlot({
          id: uuidv4(),
          active: newSlot.active,
          name: newSlot.name,
          data: newSlot.data.toLocaleDateString(),
          from: newSlot.from + i,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["sloty"] });
      setNewSlot({
        name: "",
        data: new Date(),
        active: true,
        from: 0,
        to: undefined,
        suggestedTo: undefined,
      });
      setUzytkownikDodawany(false);

      toast({
        title:
          ileSlotowDodac() === 1
            ? "Dodano Slot"
            : `Dodano ${ileSlotowDodac()} slotów`,
        description:
          ileSlotowDodac() === 1
            ? `${newSlot.name} w dniu ${newSlot.data.toLocaleDateString(
                "pl-PL",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )} godzina: ${newSlot.from}`
            : `${newSlot.name} w dniu ${newSlot.data.toLocaleDateString(
                "pl-PL",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )} od godziny: ${newSlot.from} do ${newSlot.to}`,
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

  const isMobile = window.innerWidth < 768; // zmienna pomocnicza zeby ogarnac responsywnosc selektorów
  useEffect(() => {
    console.log(
      "Nowa godzina DO:",
      newSlot.to,
      "Suegrowana do",
      newSlot.suggestedTo
    );
  }, [newSlot]);
  return (
    <Box pt={4}>
      {slotsQuery.isLoading && <p>Ładowanie slotów...</p>}
      {slotsQuery.error && (
        <p>Błąd wczytywania danych: {(slotsQuery.error as Error).message}</p>
      )}
      <ToastContainer />
      {/* Formularz */}

      <HStack gap={2}>
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
            const wybranaGodzina = parseInt(e.target.value);

            setNewSlot((prev) => ({
              ...prev,
              from: wybranaGodzina,
              to: undefined,
              suggestedTo: wybranaGodzina + 1,
            }));
          }}
        >
          <option value="" disabled hidden>
            {slotsQuery.isLoading
              ? isMobile
                ? "Ładowanie..."
                : "Ładowanie godzin"
              : isMobile
              ? "Od"
              : "Od godziny"}
          </option>

          {dostepneGodzinyOd.map((godzina, index) => (
            <option key={index} value={godzina}>
              {godzina}
            </option>
          ))}
        </StyledSelect>
        <StyledSelect
          value={
            typeof newSlot.to === "number"
              ? newSlot.to
              : newSlot.suggestedTo ?? ""
          }
          bg="white"
          color="black"
          fontSize={{ base: 12, md: 14, lg: 16 }}
          height={10}
          textAlign={"center"}
          borderRadius={5}
          px={5}
          onChange={(e) => {
            const wybraneDo = parseInt(e.target.value);
            if (wybraneDo <= newSlot.from) {
              toast({
                title: "Błędny zakres godzin",
                description: "Godzina 'do' musi być późniejsza niż 'od'.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
              return;
            }
            setNewSlot((prev) => ({
              ...prev,
              to: wybraneDo,
              suggestedTo: undefined,
            }));
          }}
        >
          <option value="" disabled hidden>
            {slotsQuery.isLoading
              ? isMobile
                ? "Ładowanie..."
                : "Ładowanie godzin"
              : isMobile
              ? "Do"
              : "Do godziny"}
          </option>

          {dostepneGodzinyDo.map((godzina, index) => (
            <option key={index} value={godzina}>
              {godzina}
            </option>
          ))}
        </StyledSelect>
        ⏰
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
                sortKey="slot"
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
            <Table.ColumnHeader>
              <SortableColumnHeader
                label="Godziny"
                sortKey="godzina"
                currentSort={sortConfig.type}
                sortAsc={sortConfig.direction === "asc"}
                onSortChange={handleSortChange}
              />
            </Table.ColumnHeader>
            <Table.ColumnHeader>Akcje</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedParticipants.map((s) => (
            <Table.Row key={s.id}>
              <Table.Cell>
                {!sprawdzCzyEdytowane(s.id, "name") ? (
                  <StyledSelect
                    value={s.name || ""}
                    fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                    onChange={(e) => {
                      dodajPoleDoMapy(s.id, "name");
                      updateSlot(s.id, "name", e.target.value)
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
                        .finally(() => usunPoleZMapy(s.id, "name"));
                    }}
                  >
                    <option
                      value=""
                      disabled={!lokalizacjeQuery.isLoading}
                      hidden={false}
                    >
                      {lokalizacjeQuery.isLoading
                        ? isMobile
                          ? "Ładowanie..."
                          : "Ładowanie lokalizacji..."
                        : isMobile
                        ? "Lokalizacja"
                        : "Wybierz lokalizację"}
                    </option>
                    {[
                      ...lokalizacjeData,
                      ...(!lokalizacjeData.some(
                        (l) => l.name === s.name && l.active
                      )
                        ? [{ id: uuidv4(), name: s.name, active: true }]
                        : []),
                    ]
                      .filter((lokalizacja) => lokalizacja.active)
                      .map((lokalizacja) => (
                        <option key={lokalizacja.name} value={lokalizacja.name}>
                          {lokalizacja.name}
                        </option>
                      ))}
                  </StyledSelect>
                ) : (
                  <Spinner ml={5} />
                )}
              </Table.Cell>
              <Table.Cell>
                <HStack>
                  <Text fontSize="sm">
                    {new Date(s.data).toLocaleDateString("pl-PL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Text>
                </HStack>
              </Table.Cell>
              <Table.Cell>
                {!sprawdzCzyEdytowane(s.id, "active") ? (
                  <Switch.Root
                    ml={5}
                    colorPalette={"green"}
                    checked={s.active}
                    size={{ base: "xs", md: "sm", lg: "md" }}
                  >
                    <Switch.HiddenInput
                      onChange={(e) => {
                        dodajPoleDoMapy(s.id, "active");
                        updateSlot(s.id, "active", e.target.checked)
                          .then(() =>
                            toast({
                              title: e.target.checked
                                ? "Slot aktywny"
                                : "Slot nieaktywny",
                            })
                          )
                          .finally(() => usunPoleZMapy(s.id, "active"));
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
                  {s.from}:00 - {s.from + 1}:00
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Dialog.Root role="alertdialog" open={idDoUsuniecia === s.id}>
                  <Dialog.Trigger asChild>
                    {!sprawdzCzyEdytowane(s.id, "usun") ? (
                      <Button
                        size="md"
                        mr={2}
                        borderRadius={5}
                        disabled={
                          sprawdzCzyEdytowane(s.id, "name") ||
                          sprawdzCzyEdytowane(s.id, "active") ||
                          sprawdzCzyEdytowane(s.id, "data")
                        }
                        color={"red.600"}
                        bg={"white"}
                        _hover={{ bg: "red", color: "white" }}
                        transition="all 0.2s"
                        _active={{ transform: "scale(0.95)", bg: "red.600" }}
                        onClick={() => {
                          dodajPoleDoMapy(s.id, "usun");
                          setIdDoUsuniecia(s.id);
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
                          Czy jesteś pewien, że chcesz usunąć slot:{" "}
                          <Text fontWeight={"bold"} textAlign={"center"} mt={5}>
                            {s.name}
                            <br />
                            {s.data.toLocaleDateString("pl-PL", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                            <br />
                            {s.from}:00 - {s.from + 1}:00
                          </Text>
                          {s.active && (
                            <Text textAlign="center" color="red" pt={5}>
                              <b>{s.name}</b> jest oznaczony jako aktywny
                            </Text>
                          )}
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => {
                                resetIdDoUsuniecia();
                                usunPoleZMapy(s.id, "usun");
                              }}
                            >
                              Nie
                            </Button>
                          </Dialog.ActionTrigger>
                          <Button
                            colorPalette="red"
                            onClick={() => {
                              resetIdDoUsuniecia();
                              deleteSlot(s.id).finally(() =>
                                usunPoleZMapy(s.id, "usun")
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
                              usunPoleZMapy(s.id, "usun");
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
