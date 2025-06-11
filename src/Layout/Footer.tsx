import { Text, Box } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg="white"
      py={4}
      textAlign="center"
      borderRadius={"0 0 25px 25px"}
      borderColor={"red"}
      overflow="hidden"
      maxW={{ base: "auto", md: "auto", lg: "1200px" }}
      mx="auto"
    >
      <Text fontSize="sm" color="#00163E">
        &copy; {new Date().getFullYear()} InstaCode. Wszystkie prawa
        zastrzeżone.
      </Text>
    </Box>
  );
};

export default Footer;
