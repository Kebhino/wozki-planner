import LogoAS from "@/assets/wozkiLogoWebP.webp";
import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { NavLink } from "../componentsWeb/NavLink";
import { useLocation } from "react-router-dom";

const NavigationBar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      backgroundColor="white"
      borderRadius={"25px 25px 0 0"}
      boxShadow="0 2px 4px rgba(0,0,0,0.05)"
      overflow="hidden"
      position="relative"
      px={6}
      maxW={{ base: "auto", md: "auto", lg: "1200px" }}
      mx="auto"
    >
      <HStack
        align="center"
        justify="space-between"
        py={2}
        px={{ base: 0, md: 4, lg: 4 }}
      >
        <NavLink to="/">
          <Image
            src={LogoAS}
            height={{ base: "20px", md: "25px", lg: "35px" }}
            ml={{ base: 0, md: 2, lg: 2 }}
            alt="InstaCode Logo"
            cursor="pointer"
          />
        </NavLink>

        <HStack
          gap={4}
          fontSize={{ base: "12px", md: "16px", lg: "18px" }}
          wrap={"wrap"}
        >
          <NavLink to="/uczestnicy">
            <Text
              position="relative"
              fontWeight={"400"}
              color="#00163E"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-2px",
                left: 0,
                width: "100%",
                height: "2px",
                background: isActive("/uczestnicy")
                  ? "linear-gradient(90deg, #6EBEFF, #3A8DFF)"
                  : "#cce7ff",
                opacity: isActive("/uczestnicy") ? 1 : 0.4,
                transition: "all 0.3s ease",
              }}
              _hover={{
                _after: {
                  opacity: 1,
                },
              }}
            >
              Uczestnicy
            </Text>
          </NavLink>
          <NavLink to="/sloty">
            <Text
              position="relative"
              fontWeight={"400"}
              color="#00163E"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-2px",
                left: 0,
                width: "100%",
                height: "2px",
                background: isActive("/sloty")
                  ? "linear-gradient(90deg, #6EBEFF, #3A8DFF)"
                  : "#cce7ff",
                opacity: isActive("/sloty") ? 1 : 0.4,
                transition: "all 0.3s ease",
              }}
              _hover={{
                _after: {
                  opacity: 1,
                },
              }}
            >
              Sloty
            </Text>
          </NavLink>

          <NavLink to="/dostepnosc">
            <Text
              position="relative"
              fontWeight={"400"}
              color="#00163E"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-2px",
                left: 0,
                width: "100%",
                height: "2px",
                background: isActive("/dostepnosc")
                  ? "linear-gradient(90deg, #6EBEFF, #3A8DFF)"
                  : "#cce7ff",
                opacity: isActive("/dostepnosc") ? 1 : 0.4,
                transition: "all 0.3s ease",
              }}
              _hover={{
                _after: {
                  opacity: 1,
                },
              }}
            >
              Dostęponość
            </Text>
          </NavLink>
          <NavLink to="/planowanie">
            <Text
              position="relative"
              fontWeight={"400"}
              color="#00163E"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-2px",
                left: 0,
                width: "100%",
                height: "2px",
                background: isActive("/planowanie")
                  ? "linear-gradient(90deg, #6EBEFF, #3A8DFF)"
                  : "#cce7ff",
                opacity: isActive("/planowanie") ? 1 : 0.4,
                transition: "all 0.3s ease",
              }}
              _hover={{
                _after: {
                  opacity: 1,
                },
              }}
            >
              Planowanie
            </Text>
          </NavLink>
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavigationBar;
