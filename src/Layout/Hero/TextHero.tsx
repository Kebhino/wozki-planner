import { Text, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionText = motion.create(Text);

const TextHero = () => {
  return (
    <Box ml={{ base: 5, md: 10 }} mt={{ base: 5, md: 10 }}>
      <MotionText
        fontSize={{ base: "25px", md: "35px", lg: "40px" }}
        fontWeight="bold"
        color="white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whiteSpace="pre-line"
      >
        Dedykowane systemy IT{"\n"}dla Twojej firmy
      </MotionText>

      <MotionText
        fontSize="xl"
        mt={4}
        color="white"
        mb={4}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      >
        Automatyzuj. Optymalizuj. Zarządzaj.
      </MotionText>
    </Box>
  );
};

export default TextHero;
