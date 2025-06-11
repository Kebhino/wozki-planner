import { HStack, SimpleGrid, Image, Box } from "@chakra-ui/react";
import logoReact from "@/assets/techonologieLoga/react.webp";
import logoPython from "@/assets/techonologieLoga/python-logo.webp";
import logoNode from "@/assets/techonologieLoga/nodejs.webp";
import logoAws from "@/assets/techonologieLoga/amazon-logo.webp";
import logoPhp from "@/assets/logaSlider/php-logo-blue.webp";
import SectorsTexT from "./OfertaTextComp";

const Technologie = () => {
  return (
    <>
      {" "}
      <Box
        bg={"white"}
        py={{ base: 2, md: 8 }}
        maxW={{ base: "auto", md: "auto", lg: "1200px" }}
        mx={"auto"}
      >
        <SectorsTexT sectorname="Technologie"></SectorsTexT>
        <SimpleGrid
          columns={1}
          gap={3}
          bg="white"
          px={{ base: 4, md: 10 }}
          textAlign="left"
          maxW={{ base: "auto", md: "auto", lg: "1200px" }}
          mx="auto"
        >
          <HStack
            justifyContent={{ base: "space-between", md: "space-between" }}
            flexWrap="wrap"
            gap={{ base: 2, md: 4 }}
            marginRight={{ base: 2, md: 10, lg: 10 }}
          >
            <Image
              height={{ base: "50px", md: "110px", lg: "150px" }}
              src={logoReact}
              transition="transform 0.3s ease"
              _hover={{
                transform: "scale(1.1)",
              }}
            />
            <Image
              transition="transform 0.3s ease"
              _hover={{
                transform: "scale(1.1)",
              }}
              height={{ base: "20px", md: "30px", lg: "50px" }}
              src={logoPhp}
            />
            <Image
              transition="transform 0.3s ease"
              _hover={{
                transform: "scale(1.1)",
              }}
              height={{ base: "17px", md: "30px", lg: "40px" }}
              src={logoNode}
            />
            <Image
              transition="transform 0.3s ease"
              _hover={{
                transform: "scale(1.1)",
              }}
              height={{ base: "25px", md: "45px", lg: "60px" }}
              src={logoPython}
            />
            <Image
              transition="transform 0.3s ease"
              _hover={{
                transform: "scale(1.1)",
              }}
              height={{ base: "20px", md: "30px", lg: "50px" }}
              src={logoAws}
            />
          </HStack>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default Technologie;
