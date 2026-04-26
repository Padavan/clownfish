import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import { ROUTES } from "../../routes";

import "./navbar.styles";
import dayjs from "dayjs";
import { DATE_FORMAT } from "utils/utils";

const getClassName = (isActive: boolean): string =>
  isActive ? "NavBar_button_active" : "NavBar_button_inactive";

const today = dayjs();
const todayString = today.format(DATE_FORMAT);
const weekStart = today.startOf("week");
const monthStart = today.startOf("month");

export function NavBar() {
  const { pathname } = useLocation();
  // console.log("match", params);

  return (
    <nav className="NavBar">
      <h1>habitshit</h1>
      <ul className="NavBar_buttongroup">
        <li>
          <NavLink exact to={`/day/${todayString}`} className={getClassName}>
            Today
          </NavLink>
        </li>
        <li>
          <NavLink to={`/week/${weekStart.format(DATE_FORMAT)}`} className={getClassName}>
            Week
          </NavLink>
        </li>
        <li>
          <NavLink to={`/month/${monthStart.format(DATE_FORMAT)}`} className={getClassName}>
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
