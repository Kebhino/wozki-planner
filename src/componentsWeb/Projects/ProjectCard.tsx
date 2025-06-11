import { Box, Card, GridItem, Image, Spacer } from "@chakra-ui/react";

import React from "react";

interface ProjectCardProps {
  children?: React.ReactNode;
  git?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  id?: string;
  title?: string;
  url?: string;
  urlImage?: string;
}

const ProjectCard = ({
  title,
  urlImage,
  icon,
  children,
  id,
}: ProjectCardProps) => {
  return (
    <GridItem marginBottom={5}>
      <Box
        transition="all 0.3s ease"
        borderRadius="3xl"
        _hover={{
          transform: "scale(1.01)",
          transition: "all 0.1s ease",
        }}
      >
        <Card.Root
          borderRadius="2xl"
          boxShadow="0 8px 20px rgba(0, 0, 0, 0.1)"
          size="lg"
          zIndex="tooltip"
          backgroundColor="#F4F6FA"
          border="1px solid rgba(144, 205, 244, 0.3)"
          h="400px"
          transition="all 0.3s ease" // płynna zmiana
          _hover={{
            backgroundColor: "#E0F4FF", // tło karty po hooverze
            transform: "scale(1.01)", // delikatne uniesienie
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)", // mocniejszy cień na hover
          }}
        >
          <Card.Header>
            {icon ? (
              <Box display="flex" justifyContent="center">
                {React.createElement(icon, {
                  color: "black",
                  width: 75,
                  height: 75,
                })}
              </Box>
            ) : urlImage ? (
              <Image
                maxW={id === "znany-lekarz" ? "280px" : "240px"}
                maxH="72px"
                mx="auto"
                src={urlImage}
                alt={title}
                padding={3}
              />
            ) : null}
          </Card.Header>
          <Card.Body mt={5} color="black" fontSize={"sm"}>
            {children}
          </Card.Body>
          <Card.Footer
            justifyContent={"space-between"}
            position="relative"
            overflow="visible"
          >
            <Spacer />
          </Card.Footer>
        </Card.Root>
      </Box>
    </GridItem>
  );
};

export default ProjectCard;
