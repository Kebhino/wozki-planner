import { Box, VStack, Text, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionText = motion.create(Text);
const MotionBox = motion.create(Box);

interface SectorTextProps {
  sectorname: string;
}

const SectorsTexT = ({ sectorname }: SectorTextProps) => {
  return (
    <VStack gap={4}>
      <Flex
        align="center"
        justify="center"
        width="100%"
        px={{ base: 4, md: 8 }}
      >
        <Flex flex="1" align="center" justify="center">
          <MotionBox
            h="2px"
            w="50%"
            bg="#0099FF"
            opacity={0.3}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transformOrigin="left"
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </Flex>

        <MotionText
          fontSize={{ base: "20px", md: "30px", lg: "40px" }}
          fontWeight="bold"
          color="#00163E"
          px={4}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, color: "#00163E" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {sectorname}
        </MotionText>

        <Flex flex="1" align="center" justify="center">
          <MotionBox
            h="2px"
            w="50%"
            bg="#0099FF"
            opacity={0.3}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transformOrigin="right"
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </Flex>
      </Flex>

      <MotionBox
        width="80px"
        height="2px"
        bg="#00163E"
        borderRadius="full"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transformOrigin="bottom"
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </VStack>
  );
};

export default SectorsTexT;
