import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import { ROUTES } from "../../routes";

import "./navbar.styles";

const getClassName = (isActive: boolean): string =>
  isActive ? "NavBar_button_active" : "NavBar_button_inactive";

export function NavBar() {
  const { pathname } = useLocation();
  // console.log("match", params);

  return (
    <nav className="NavBar">
      <h1>habitshit</h1>
      <ul className="NavBar_buttongroup">
        <li>
          <NavLink exact to={ROUTES.AGENDA} className={getClassName}>
            Agenda
          </NavLink>
        </li>
        <li>
          <NavLink to={ROUTES.WEEKVIEW} className={getClassName}>
            Week
          </NavLink>
        </li>
        <li>
          <NavLink to={ROUTES.MONTHVIEW} className={getClassName}>
            Month
          </NavLink>
        </li>
      </ul>
      <ul className="NavBar_buttongroup">
        {pathname !== ROUTES.NEWSERIES && (
          <li>
            <NavLink to={ROUTES.NEWSERIES} className={getClassName}>
              + Add
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
