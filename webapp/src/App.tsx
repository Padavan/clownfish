import * as React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./style.css";
import "./pico.css";
import { routes } from "routes";
import { NavBar } from "./component/navbar/navbar.component";
import { DataProvider } from "providers/data.provider";

export const App = () => {
  return (
    <DataProvider>
      <HashRouter>
        <NavBar />
        <Switch>
          {routes.map((r) => (
            <Route {...r} key={r.id} />
          ))}
        </Switch>
      </HashRouter>
    </DataProvider>
  );
};
