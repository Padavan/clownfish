import React, { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useData } from "providers/data.provider";
import { Occurance } from "utils/series.types";
import {
  DATE_FORMAT,
  findNextOccurance,
  formatDate,
  stringToColour,
} from "utils/utils";

const today = dayjs();
const todayString = dayjs().format(DATE_FORMAT);

const buildOverviewDays = (day: Dayjs) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const str = day.startOf('week').add(i, 'day').format(DATE_FORMAT);
    days.push(str);
  }

  return days;
};



export function WeekViewPage() {
  const { occuranceList, seriesMap } = useData();

  const overviewData = useMemo(
    () =>
      buildOverviewDays(today).map((d) => ({
        date: d,
        occurances: occuranceList.filter((o) => o.date === d),
      })),
    [occuranceList],
  );


  return (
    <main>
      <section className="vflex" style={{ justifyContent: "center" }}>
        <div className="overview" style={{ justifyContent: "center" }}>
          {overviewData.map((d) => {
            return (
              <article
                key={d.date}
                style={{ margin: 0 }}
                className={d.date === todayString ? "vflexCenter today" : "vflexCenter"}
              >
                <span>{dayjs(d.date).format("ddd")}</span>
                <span>{dayjs(d.date).format("DD")}</span>
              </article>
            );
          })}
          {overviewData.map((d) => {
            return (
              <span style={{ display: "flex", flexDirection: "column", gap: "4px", overflow: 'hidden' }}>
                {d.occurances.map((item) => {
                  const color = stringToColour(item.seriesId) ?? "#000";
                  const series = seriesMap.get(item.seriesId);

                  return (
                    <div
                      title={seriesMap.get(item.seriesId)?.name}
                      className="weekLine"
                      style={{
                        borderColor: color,
                        borderStyle: 'solid',
                      }}
                    >
                      <span className="weekLineTitle">{series?.name}</span>
                      <small>{series?.strategy} -- day {item.occurance}</small>
                    </div>
                  );
                })}
              </span>
            );
          })}
        </div>
      </section>
    </main>
  );
}