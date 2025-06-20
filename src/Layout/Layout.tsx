import { Grid, GridItem } from "@chakra-ui/react";
import NavigationBar from "./NavBar";
import Footer from "./Footer";
import { useGlobalDialogStore } from "@/componentsWeb/stores/useGlobalDialogStore";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const czyDialogJestOtwarty = useGlobalDialogStore((s) => s.idDoUsuniecia);
  return (
    <Grid
      templateRows="auto  auto auto"
      templateColumns={"1fr"}
      minH="auto"
      maxW={"1200px"}
      mx={"auto"}
      justifyContent={"center"}
      w={"100%"}
      transform={czyDialogJestOtwarty ? "translateX(-10px)" : "none"}
    >
      <GridItem>
        <NavigationBar />
      </GridItem>

      <GridItem>{children}</GridItem>
      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
