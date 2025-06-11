import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import SectorsTexT from "./OfertaTextComp";

const Oferta = () => {
  return (
    <Box
      bg="white"
      py={{ base: 2, md: 4 }}
      textAlign="center"
      transition="all 0.3s ease"
      maxW="1200px"
      mx={"auto"}
      pt={10}
    >
      <SectorsTexT sectorname={"Uczestnicy"} />

      <SimpleGrid
        alignItems="start"
        columns={{ base: 1, md: 3 }}
        color={"#00163E"}
        gap={8}
        mt={10}
        px={{ base: 4, md: 20 }}
        pb={10}
      >
        <Box
          textAlign="center"
          lineHeight="1.6"
          mb={4}
          _hover={{
            bg: "#cce7ff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            transform: "scale(1.05)",
            transition: "all 0.3s ease",
            borderRadius: "20px",
          }}
          p={3}
        >
          <Text
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="bold"
          >
            Systemy produkcyjne
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md", lg: "sm" }}
            maxW="400px"
            mt={2}
          >
            Projektujemy i wdrażamy systemy wspierające procesy produkcyjne – od
            monitoringu maszyn po zarządzanie zleceniami i kontrolę jakości.
            Nasze rozwiązania zwiększają efektywność, automatyzują raportowanie
            i pomagają w podejmowaniu lepszych decyzji operacyjnych.
          </Text>
        </Box>

        <Box
          textAlign="center"
          lineHeight="1.6"
          _hover={{
            bg: "#cce7ff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            transform: "scale(1.05)",
            transition: "all 0.3s ease",
            borderRadius: "20px",
          }}
          p={3}
        >
          <Text
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="bold"
            textAlign="center"
          >
            Aplikacje Webowe
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md", lg: "sm" }}
            textAlign={"center"}
            maxW="400px"
            mt={2}
          >
            Tworzymy nowoczesne aplikacje webowe dopasowane do potrzeb klienta.
            Od prostych paneli po zaawansowane systemy – działające na każdym
            urządzeniu, bezpieczne i wydajne. Pomagamy rozwijać Twój biznes
            online z wykorzystaniem nowoczesnych technologii.
          </Text>
        </Box>

        <Box
          textAlign="center"
          lineHeight="1.6"
          _hover={{
            bg: "#cce7ff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            transform: "scale(1.05)",
            transition: "all 0.3s ease",
            borderRadius: "20px",
          }}
          p={3}
        >
          <Text
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="bold"
          >
            Integracje i automatyzacje
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md", lg: "sm" }}
            maxW="400px"
            mt={2}
          >
            Łączymy systemy i automatyzujemy procesy, byś mógł działać szybciej
            i efektywniej. Integrujemy z API, CRM, sklepami online i innymi
            narzędziami, eliminując ręczne czynności i błędy. Twoja firma
            pracuje płynniej i oszczędza czas.
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Oferta;
