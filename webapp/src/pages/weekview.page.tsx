import React, { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useData } from "providers/data.provider";
import { Occurance } from "utils/series.types";
import { DATE_FORMAT, findNextOccurance, formatDate, stringToColour } from "utils/utils";
import { useHistory } from "react-router";

const today = dayjs();
const todayString = dayjs().format(DATE_FORMAT);

const buildOverviewDays = (day: Dayjs) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const str = day.startOf("week").add(i, "day").format(DATE_FORMAT);
    days.push(str);
  }

  return days;
};

export function WeekViewPage({ day }: { day: string }) {
  const { occuranceList, seriesMap } = useData();
  const history = useHistory();

  const overviewData = useMemo(
    () =>
      buildOverviewDays(dayjs(day)).map((d) => ({
        date: d,
        occurances: occuranceList.filter((o) => o.date === d),
      })),
    [occuranceList, day],
  );

  const isCurrentWeek = overviewData.some((d) => d.date === todayString);

  return (
    <main>
      {/*  {day === today.format(DATE_FORMAT)
        ? <h4>Today: {day}</h4>
        : <h4>Day: {day}</h4>
      }*/}
      <h4>
        Week: {dayjs(overviewData[0]?.date).format("MMM DD")} ---{" "}
        {dayjs(overviewData[6]?.date).format("MMM DD")} {isCurrentWeek && "(Current week)"}
      </h4>
      <section className="hflex" style={{ justifyContent: "center" }}>
        <button
          className="changeViewButton outline"
          data-tooltip="Previous week"
          onClick={() =>
            history.push(`/week/${dayjs(day).subtract(1, "week").format(DATE_FORMAT)}`)
          }
        >
          {"<"}
        </button>
        <div className="overview" style={{ justifyContent: "center" }}>
          {overviewData.map((d) => {
            return (
              <article
                key={d.date}
                style={{ margin: 0, cursor: "pointer" }}
                className={d.date === todayString ? "vflexCenter today" : "vflexCenter"}
                onClick={() => history.push(`/day/${d.date}`)}
              >
                <span>{dayjs(d.date).format("ddd")}</span>
                <span>{dayjs(d.date).format("DD")}</span>
              </article>
            );
          })}
          {overviewData.map((d) => {
            return (
              <span
                style={{ display: "flex", flexDirection: "column", gap: "4px", overflow: "hidden" }}
              >
                {d.occurances.map((item) => {
                  const color = stringToColour(item.seriesId) ?? "#000";
                  const series = seriesMap.get(item.seriesId);

                  return (
                    <div
                      title={seriesMap.get(item.seriesId)?.name}
                      className="weekLine"
                      style={{
                        borderColor: color,
                        borderStyle: "solid",
                      }}
                    >
                      <span className="weekLineTitle">{series?.name}</span>
                      <small>
                        {series?.strategy} -- day {item.occurance}
                      </small>
                    </div>
                  );
                })}
              </span>
            );
          })}
        </div>
        <button
          className="changeViewButton outline"
          data-tooltip="Next week"
          onClick={() => history.push(`/week/${dayjs(day).add(1, "week").format(DATE_FORMAT)}`)}
        >
          {">"}
        </button>
      </section>
    </main>
  );
}
