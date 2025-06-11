import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import type { LinkProps as RouterLinkProps } from "react-router-dom";
import type { FC } from "react";

type NavLinkProps = ChakraLinkProps & RouterLinkProps;

export const NavLink: FC<NavLinkProps> = (props) => {
  return (
    <ChakraLink
      color={"black"}
      fontWeight={"600"}
      textShadow="0px 0px 1px black"
      as={RouterLink}
      {...props}
    />
  );
};
