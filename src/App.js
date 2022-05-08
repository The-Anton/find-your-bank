import './App.css';
import React from "react";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import Appbar from "./components/Bar/Bar";
import BankDetails from "./pages/BankDetails/BankDetails";
import AllBanks from "./pages/AllBanks/AllBanks";
import Favourite from "./pages/Favourite/Favourite";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Montserrat",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif"
    ].join(",")
  }
});

function App() {
  return (
<ThemeProvider theme={theme}>      
      <Appbar />
      <HashRouter>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/all-banks" />
          </Route>
          <Route path="/all-banks" exact>
            <AllBanks />
          </Route>
          <Route path="/bank-details/:id">
            <BankDetails />
          </Route>
          <Route path="/favourites">
            <Favourite />
          </Route>
          <Route component={NotFoundPage}/>
        </Switch>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
