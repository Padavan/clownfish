import React, { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useData } from "providers/data.provider";
import { Occurance } from "utils/series.types";
import { DATE_FORMAT, findNextOccurance, stringToColour } from "utils/utils";
import { useHistory } from "react-router";

const today = dayjs();
// const todayString = dayjs().format(DATE_FORMAT);

const buildOverviewDays = (day: Dayjs) => {
  const days = [];
  for (let i = -2; i < 5; i++) {
    days.push(day.add(i, "day").format(DATE_FORMAT));
  }

  return days;
};

export function AgendaPage({ day }: { day: string }) {
  console.log("AgendaPage", day);
  const { occuranceList, seriesMap, patchOccurance } = useData();
  const history = useHistory();

  const overviewData = useMemo(
    () =>
      buildOverviewDays(dayjs(day)).map((d) => ({
        date: d,
        occurances: occuranceList.filter((o) => o.date === d),
      })),
    [occuranceList, day],
  );

  const dayData = useMemo(() => {
    return occuranceList.filter((o) => o.date === day);
  }, [occuranceList, day]);

  const handleMarkDone = (target: Occurance) => {
    const newOccurance = { ...target, status: "completed" };
    patchOccurance(newOccurance);
  };

  return (
    <main>
      {day === today.format(DATE_FORMAT) ? <h4>Today: {day}</h4> : <h4>Day: {day}</h4>}
      <section className="hflex" style={{ justifyContent: "center" }}>
        <button
          className="changeViewButton outline"
          data-tooltip="Previous day"
          onClick={() => history.push(`/day/${dayjs(day).subtract(1, "day").format(DATE_FORMAT)}`)}
        >
          {"<"}
        </button>
        <div className="overview" style={{ justifyContent: "center", maxWidth: "720px" }}>
          {overviewData.map((d) => {
            return (
              <article
                key={d.date}
                style={{ margin: 0, cursor: "pointer" }}
                onClick={() => history.push(`/day/${d.date}`)}
                className={[
                  "vflexCenter",
                  d.date === today.format(DATE_FORMAT) && "today",
                  d.date === day && "focusDay",
                ]
                  .filter(Boolean)
                  .join(" ")}
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
        <button
          className="changeViewButton outline"
          data-tooltip="Next day"
          onClick={() => history.push(`/day/${dayjs(day).add(1, "day").format(DATE_FORMAT)}`)}
        >
          {">"}
        </button>
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
