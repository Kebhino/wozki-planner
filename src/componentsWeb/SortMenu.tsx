import { Menu, Portal } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

type SortType = "surname" | "status";

interface SortMenuProps {
  sortType: SortType;
  sortAsc: boolean;
  setSortType: (type: SortType) => void;
  setSortAsc: (asc: boolean) => void;
}

const SortMenu = ({
  sortType,
  sortAsc,
  setSortType,
  setSortAsc,
}: SortMenuProps) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          bg="white"
          color="black"
          height={10}
          borderRadius={5}
          _hover={{ bg: "gray.100" }}
        >
          Sortuj: {sortType === "surname" ? "Nazwisko" : "Status"}{" "}
          {sortAsc ? "↑" : "↓"}
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius={5}
            boxShadow="lg"
            minW="170px"
          >
            <Menu.Item value="surname" onSelect={() => setSortType("surname")}>
              Nazwisko
            </Menu.Item>
            <Menu.Item value="status" onSelect={() => setSortType("status")}>
              Status
            </Menu.Item>

            <Menu.Separator />

            <Menu.Item value="direction" onSelect={() => setSortAsc(!sortAsc)}>
              Zmień kolejność: {sortAsc ? "A-Z" : "Z-A"}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default SortMenu;
