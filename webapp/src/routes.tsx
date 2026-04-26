import React from "react";
import { RouteProps } from "react-router-dom";
import { AgendaPage } from "./pages/agenda.page";
import { NewSeriesPage } from "./pages/newseries.page";
import { WeekViewPage } from "pages/weekview.page";

export const ROUTES = {
  AGENDA: "/",
  WEEKVIEW: "/week",
  MONTHVIEW: "/month",
  NEWSERIES: "/newseries",
  SERIESVIEW: "/series/{:id}",
  SETTINGS: "/settings",
} as const;

export const routes: Array<RouteProps & { id: string }> = [
  { id: ROUTES.AGENDA, path: ROUTES.AGENDA, exact: true, children: <AgendaPage /> },
  { id: ROUTES.NEWSERIES, path: ROUTES.NEWSERIES, children: <NewSeriesPage /> },
  { id: ROUTES.WEEKVIEW, path: ROUTES.WEEKVIEW, children: <WeekViewPage /> },
  // { id: ROUTES.CAMPAIGNS, path: ROUTES.CAMPAIGNS, children: <CampaignsPage />, },
  // { id: ROUTES.NEW_CAMPAIGN, path: ROUTES.NEW_CAMPAIGN, children: <NewCampaignPage /> },
];
