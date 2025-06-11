// src/pages/Contact.tsx
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { NavLink } from "./NavLink";
import SectorsTexT from "./MainPage/OfertaTextComp";

const ONasElemenent = () => {
  return (
    <>
      <Box
        p={8}
        bg={"white"}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          backgroundColor="#F4F6FA"
          boxShadow="0 8px 20px rgba(0, 0, 0, 0.1)"
          p={8}
          borderRadius="3xl"
          maxW="1000"
          textAlign="center"
          _hover={{
            backgroundColor: "", // tło karty po hooverze

            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
            transition: "all 0.1s ease", // mocniejszy cień na hover
          }}
        >
          <Heading as={"h1"} size="lg" mb={4} color="blue.500">
            <SectorsTexT sectorname={"O Nas"} />
          </Heading>
          <VStack gap={4} align="start" textAlign={"left"} pt={5}>
            <Text fontSize="lg" color="gray.700" as={"h2"}>
              Systemami informatycznymi zajmujemy się od <b>2002 roku</b>, gdy
              internet dopiero na dobre się rozkręcał. Na przestrzeni lat
              tworzyliśmy <b>dedykowane systemy informatyczne</b> dla wielu
              firm, zawsze skupiając się na{" "}
              <b>indywidualnych potrzebach naszych klientów</b>.
            </Text>

            <Text fontSize="lg" color="gray.700" as={"h2"}>
              Potrafimy zrozumieć, czego klient potrzebuje, i zaproponować
              rozwiązania, z których będzie zadowolony.
            </Text>

            <Text fontSize="lg" color="gray.700" as={"h2"}>
              Pierwsze nasze systemy automatyzowały usługi dostarczane przez
              providerów internetowych — obsługę domen internetowych, tworzenie
              kont pocztowych, FTP, baz danych, hosting stron. Wszystko to w
              czasach, gdy internet dopiero raczkował.
            </Text>
            <Text fontSize="lg" color="gray.700" as={"h2"}>
              Przez lata pozostawaliśmy na bieżąco z rozwojem technologii
              zdobywając doświadczenie i realizując kolejne projekty.
            </Text>

            <Button
              w={"100%"}
              borderRadius={30}
              backgroundColor="#00163E"
              asChild
              mt={10}
              _hover={{
                transform: "scale(1.02)", // delikatne powiększenie przy hoverze
                transition: "all 0.3s ease", // płynna zmiana
              }}
            >
              <NavLink to="/realizacje">
                <Text fontSize="lg" color="white">
                  Zobacz nasze realizacje
                </Text>
              </NavLink>
            </Button>
          </VStack>
        </Box>
      </Box>
    </>
  );
};

export default ONasElemenent;
