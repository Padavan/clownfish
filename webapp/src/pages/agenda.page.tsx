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
  for (let i = -2; i < 5; i++) {
    days.push(day.add(i, "day").format(DATE_FORMAT));
  }

  return days;
};

export function AgendaPage() {
  const { occuranceList, seriesMap, patchOccurance } = useData();

  const overviewData = useMemo(
    () =>
      buildOverviewDays(today).map((d) => ({
        date: d,
        occurances: occuranceList.filter((o) => o.date === d),
      })),
    [occuranceList],
  );

  const dayData = useMemo(
    () => occuranceList.filter((o) => o.date === todayString),
    [occuranceList],
  );

  const handleMarkDone = (target: Occurance) => {
    const newOccurance = { ...target, status: "completed" };
    patchOccurance(newOccurance);
  };

  return (
    <main>
      <h4>Today: {formatDate(today)}</h4>
      <section className="vflex" style={{ justifyContent: "center" }}>
        <div className="overview" style={{ justifyContent: "center", maxWidth: '720px' }}>
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
              <div>
                <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  {d.occurances.map((item) => {
                    const color = stringToColour(item.seriesId) ?? "#000";
                    return (
                      <span
                        title={seriesMap.get(item.seriesId)?.name}
                        className="line"
                        style={{
                          background: color,
                        }}
                      />
                    );
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h5>Tasks: {dayData.length}</h5>
        <div className="vflex">
          {dayData.map((occurance) => {
            const series = seriesMap.get(occurance.seriesId);
            const nextOccDate = findNextOccurance(occuranceList, occurance);
            const nextDate = nextOccDate ? dayjs(nextOccDate) : undefined;

            console.log("===status", occurance.status);

            return (
              <article
                style={{
                  borderLeftColor: stringToColour(occurance.seriesId ?? "nocolor"),
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                  padding: "0.5rem  1rem 1rem 0",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <label
                  htmlFor={occurance.id}
                  style={{ height: "100%", width: "60px", padding: "1.5rem 1rem" }}
                >
                  <input
                    id={occurance.id}
                    type="checkbox"
                    onChange={() => handleMarkDone(occurance)}
                    checked={occurance.status === "completed"}
                  />
                </label>
                <span className="vflex">
                  <span className="agendaCardTitle">{series?.name}</span>
                  <span>{series?.description}</span>
                  <small>
                    Occurance:{occurance.occurance},{" "}
                    {nextDate ? `Next: ${nextDate.format("MMMM DD")}` : ""}
                  </small>
                </span>
                <span
                  className="hflex"
                  style={{ alignSelf: "flex-end", marginLeft: "auto" }}
                ></span>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
