import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/Theme";
import MainPage from "./pages/MainPage";

const router = createBrowserRouter([
  {
    children: [{ path: "/", element: <MainPage /> }],
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default App;
