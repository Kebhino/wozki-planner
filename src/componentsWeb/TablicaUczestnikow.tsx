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
import { useEdytowanePolaMapa } from "./stores/useEdytowanePolaMapa";
import { Tooltip } from "@/components/ui/tooltip";
const StyledSelect = chakra("select");
const { ToastContainer, toast } = createStandaloneToast();

const statusOptions: Status[] = ["Pionier St.", "Pionier Pom.", "Głosiciel"];

const TablicaUczestnikow = () => {
  const queryClient = useQueryClient();
  const [uzytkownikDodawany, setUzytkownikDodawany] = useState(false);
  const { setIdDoUsuniecia, idDoUsuniecia, resetIdDoUsuniecia } =
    useGlobalDialogStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    type: "surname",
    direction: "asc",
  });

  const { dodajPoleDoMapy, sprawdzCzyEdytowane, usunPoleZMapy } =
    useEdytowanePolaMapa();

  const position = useBreakpointValue({
    base: "top",
    lg: "bottom",
  }) as ToastPosition;
  const [newParticipant, setNewParticipant] = useState<Omit<Participant, "id">>(
    {
      name: "",
      status: "Głosiciel",
      active: true,
    }
  );

  const {
    data: participants = [],
    isLoading,
    isError,
    error,
  } = useQuery<Participant[]>({
    queryKey: ["participants"],
    queryFn: ({ signal }) => getParticipants(signal),
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

    const names = newParticipant.name
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    try {
      setUzytkownikDodawany(true);
      for (const name of names) {
        const payload: AddParticipantProps = {
          id: uuidv4(),
          active: newParticipant.active,
          name: name,
          status: newParticipant.status,
        };
        await addParticipant(payload);
      }
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      setNewParticipant({ name: "", status: "Głosiciel", active: true });
      setUzytkownikDodawany(false);

      toast({
        title:
          names.length > 1
            ? `Dodano ${names.length} uczestników`
            : "Dodano uczestnika",
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
    value: string | boolean
  ) => {
    try {
      await updateParticipantInDb(id, field, value);
      await queryClient.invalidateQueries({ queryKey: ["participants"] });
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
          placeholder="Dane nowego uczestnika lub wiele osób po przecinkach"
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
          fontSize={{ base: 10, md: 12, lg: 15 }}
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
          disabled={uzytkownikDodawany}
          onClick={handleAddParticipant}
          bg="white"
          color="black"
          height={10}
          fontSize={{ base: 8, md: 12, lg: 15 }}
          textAlign={"center"}
          borderRadius={10}
          _hover={{ bg: "green.400", color: "white" }}
        >
          {uzytkownikDodawany ? (
            <Spinner size="sm" color="gray.500" />
          ) : (
            <IoMdAdd />
          )}
        </Button>
      </HStack>

      {/* Tabela */}
      <Table.Root
        width="100%"
        mt={5}
        color="gray.800"
        background="white"
        boxShadow="md"
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        interactive
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader
              bg="gray.100"
              fontWeight="semibold"
              fontSize="sm"
              letterSpacing="wide"
              textTransform="uppercase"
              color="gray.600"
              py={3}
              px={4}
            >
              <SortableColumnHeader
                label="Imię i nazwisko"
                sortKey="surname"
                currentSort={sortConfig.type}
                sortAsc={sortConfig.direction === "asc"}
                onSortChange={handleSortChange}
              />
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="gray.100"
              fontWeight="semibold"
              fontSize="sm"
              letterSpacing="wide"
              textTransform="uppercase"
              color="gray.600"
              py={3}
              px={4}
            >
              <SortableColumnHeader
                label="Status"
                sortKey="status"
                currentSort={sortConfig.type}
                sortAsc={sortConfig.direction === "asc"}
                onSortChange={handleSortChange}
              />
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="gray.100"
              fontWeight="semibold"
              fontSize="sm"
              letterSpacing="wide"
              textTransform="uppercase"
              color="gray.600"
              py={3}
              px={4}
            >
              Akcje
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedParticipants.map((p) => (
            <Table.Row key={p.id}>
              <Table.Cell>
                {!sprawdzCzyEdytowane(p.id, "name") ? (
                  <Editable.Root
                    defaultValue={p.name}
                    submitMode={"enter"}
                    disabled={sprawdzCzyEdytowane(p.id, "name")}
                    opacity={sprawdzCzyEdytowane(p.id, "name") ? 0.4 : 1}
                    onValueCommit={(val) => {
                      dodajPoleDoMapy(p.id, "name");

                      updateParticipant(p.id, "name", val.value)
                        .then(() => toast({ title: "Zmieniono imię" }))
                        .finally(() => usunPoleZMapy(p.id, "name"));
                    }}
                  >
                    <Editable.Preview />
                    <Stack direction={{ base: "column", md: "row" }}>
                      <Editable.Input />
                      <Editable.Control>
                        <Editable.EditTrigger asChild>
                          <Tooltip
                            content="Kliknij, aby edytować"
                            showArrow
                            contentProps={{ css: { "--tooltip-bg": "gray" } }}
                            openDelay={300}
                            closeDelay={100}
                          >
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
                          </Tooltip>
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
                  <Spinner size="sm" color="gray.500" />
                )}
              </Table.Cell>
              <Table.Cell>
                <HStack>
                  {!sprawdzCzyEdytowane(p.id, "status") ? (
                    <StyledSelect
                      defaultValue={p.status}
                      fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                      onChange={(e) => {
                        dodajPoleDoMapy(p.id, "status");
                        updateParticipant(p.id, "status", e.target.value)
                          .then(() =>
                            toast({
                              description: (
                                <Text>
                                  Zmieniono status uczestnika {p.name} na:{" "}
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
                          .finally(() => usunPoleZMapy(p.id, "status"));
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </StyledSelect>
                  ) : (
                    <Spinner ml={5} size="sm" color="gray.500" />
                  )}
                  {!sprawdzCzyEdytowane(p.id, "active") ? (
                    <Switch.Root
                      ml={5}
                      colorPalette={"green"}
                      checked={p.active}
                      size={{ base: "xs", md: "sm", lg: "md" }}
                    >
                      <Switch.HiddenInput
                        onChange={(e) => {
                          dodajPoleDoMapy(p.id, "active");
                          updateParticipant(p.id, "active", e.target.checked)
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
                    <Spinner ml={7} size="md" color="gray.500" />
                  )}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Dialog.Root role="alertdialog" open={idDoUsuniecia === p.id}>
                  <Dialog.Trigger asChild>
                    {!sprawdzCzyEdytowane(p.id, "usun") ? (
                      <Button
                        size="md"
                        mr={2}
                        borderRadius={5}
                        disabled={
                          sprawdzCzyEdytowane(p.id, "name") ||
                          sprawdzCzyEdytowane(p.id, "active") ||
                          sprawdzCzyEdytowane(p.id, "status")
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
                      <Spinner mr={6} size={"md"} color="gray.500" />
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
                              deleteParticipant(p.id).finally(() =>
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

export default TablicaUczestnikow;
