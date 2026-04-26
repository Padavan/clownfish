import React from "react";
import { Redirect, RouteProps } from "react-router-dom";
import { AgendaPage } from "./pages/agenda.page";
import { NewSeriesPage } from "./pages/newseries.page";
import { WeekViewPage } from "pages/weekview.page";
import { MonthViewPage } from "pages/monthview.page";
import dayjs from "dayjs";
import { DATE_FORMAT } from "utils/utils";

export const ROUTES = {
  AGENDA: "/",
  DAYVIEW: "/day/:day",
  WEEKVIEW: "/week/:day",
  MONTHVIEW: "/month/:day",
  NEWSERIES: "/newseries",
  SERIESVIEW: "/series/{:id}",
  SETTINGS: "/settings",
} as const;

const today = dayjs().format(DATE_FORMAT);

export const routes: Array<RouteProps & { id: string }> = [
  {
    id: ROUTES.AGENDA,
    path: ROUTES.AGENDA,
    exact: true,
    children: <Redirect to={`/day/${today}`} />,
  },
  { id: ROUTES.NEWSERIES, path: ROUTES.NEWSERIES, children: <NewSeriesPage /> },
  {
    id: ROUTES.WEEKVIEW,
    path: ROUTES.WEEKVIEW,
    children: ({ match }) => <WeekViewPage day={match?.params["day"] ?? today} />,
  },
  {
    id: ROUTES.MONTHVIEW,
    path: ROUTES.MONTHVIEW,
    children: ({ match }) => <MonthViewPage day={match?.params["day"] ?? today} />,
  },
  {
    id: ROUTES.DAYVIEW,
    path: ROUTES.DAYVIEW,
    exact: true,
    children: ({ match }) => <AgendaPage day={match?.params["day"] ?? today} />,
  },
  // { id: ROUTES.CAMPAIGNS, path: ROUTES.CAMPAIGNS, children: <CampaignsPage />, },
  // { id: ROUTES.NEW_CAMPAIGN, path: ROUTES.NEW_CAMPAIGN, children: <NewCampaignPage /> },
];
