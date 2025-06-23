import { Route, Routes } from "react-router-dom";
import Lokalizacje from "./componentsWeb/Lokalizacje";
import About from "./pages/About";
import RealizacjeGrid from "./pages/RealizacjeGrid";
import TablicaUczestnikow from "./componentsWeb/TablicaUczestnikow";
import Layout from "./Layout/Layout";

function App() {
  return (
    <>
      <Routes>
        {/* Strona główna */}
        <Route
          path="/"
          element={
            <>
              <Layout>
                <TablicaUczestnikow />
              </Layout>
            </>
          }
        />

        {/* Podstrona Kontakt */}
        <Route
          path="/lokalizacje"
          element={
            <>
              <Layout>
                <Lokalizacje />
              </Layout>
            </>
          }
        />
        <Route
          path="/uczestnicy"
          element={
            <>
              <RealizacjeGrid />
            </>
          }
        />

        <Route
          path="/dostepnosc"
          element={
            <>
              <About />
            </>
          }
        />
        <Route
          path="/planowanie"
          element={
            <>
              <About />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
