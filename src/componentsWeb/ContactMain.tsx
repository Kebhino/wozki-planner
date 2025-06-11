import { Grid, HStack, Text, Box } from "@chakra-ui/react";
import ProjectCard from "./Projects/ProjectCard";
import { Building, InfoIcon, Mail, Send, Phone } from "lucide-react";

const ContactMain = () => {
  return (
    <>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(2, 1fr)",
          xl: "repeat(2, 1fr)",
        }}
        gap={6}
        p={5}
        maxW="1200px"
        w="100%"
        mx="auto"
        bg={"white"}
      >
        <ProjectCard icon={Building} key={"karta kontakt"}>
          <HStack gap={2}>
            <InfoIcon size={20} color="black" />
            <Text fontWeight="semibold" fontSize="md">
              Właściciel marki InstaCode
            </Text>
          </HStack>

          <Box p={4} borderRadius="md">
            <Text fontSize="lg" fontWeight="bold" color="gray.700">
              Elemel Sp. z o.o.
            </Text>

            <Text fontSize="sm" color="gray.700">
              KRS:{" "}
              <Text as="span" fontWeight="semibold" color="black">
                0001147774
              </Text>
            </Text>

            <Text fontSize="sm" color="gray.700">
              NIP:{" "}
              <Text as="span" fontWeight="semibold" color="black">
                8961647310
              </Text>
            </Text>
          </Box>
        </ProjectCard>
        <ProjectCard icon={Mail} key={"karta kontakt2"}>
          <HStack>
            <InfoIcon size={20} color="black" />
            <Text fontWeight="semibold" fontSize="md" color={"gray.700"}>
              Masz pytania? Skontaktuj się z nami!
            </Text>
          </HStack>

          <HStack mt={5}>
            <Send size={20} color="black" />
            <Text ml={2} color={"blue"} fontWeight={"semibold"} asChild>
              <a href="mailto:biuro@elemel.pl">biuro@elemel.pl </a>
            </Text>
          </HStack>
          <HStack mt={2}>
            <Phone size={20} color="black" />
            <Text ml={1} color={"blue"} fontWeight={"semibold"} asChild>
              <a href="tel:+48 509 96 76 23 ">+48 509 96 76 23</a>
            </Text>
          </HStack>
        </ProjectCard>
      </Grid>
    </>
  );
};

export default ContactMain;
