import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./style.css";
import "./pico.css";
import { routes } from "routes";
import { NavBar } from "./component/navbar/navbar.component";
import { DataProvider } from "providers/data.provider";

export const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <NavBar />
        {routes.map((r) => (
          <Route {...r} key={r.id} />
        ))}
      </BrowserRouter>
    </DataProvider>
  );
};
