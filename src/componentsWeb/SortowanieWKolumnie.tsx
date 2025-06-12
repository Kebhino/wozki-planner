import { HStack, Text, Icon } from "@chakra-ui/react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

type SortType = "surname" | "status";

interface SortableColumnHeaderProps {
  label: string;
  sortKey: SortType;
  currentSort: SortType;
  sortAsc: boolean;
  onSortChange: (key: SortType) => void;
}

const SortableColumnHeader = ({
  label,
  sortKey,
  currentSort,
  sortAsc,
  onSortChange,
}: SortableColumnHeaderProps) => {
  const isActive = currentSort === sortKey;
  const icon = sortAsc ? MdArrowDropUp : MdArrowDropDown;

  return (
    <HStack
      gap={1}
      cursor="pointer"
      userSelect="none"
      onClick={() => onSortChange(sortKey)}
      _hover={{ color: "gray.700" }}
    >
      <Text fontWeight="bold">{label}</Text>
      <Icon
        as={icon}
        boxSize={7}
        color={isActive ? "black" : "gray.300"}
        transition="color 0.2s"
      />
    </HStack>
  );
};

export default SortableColumnHeader;
