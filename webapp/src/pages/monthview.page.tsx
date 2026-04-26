import React, { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useData } from "providers/data.provider";
import { Occurance } from "utils/series.types";
import { DATE_FORMAT, findNextOccurance, formatDate, stringToColour } from "utils/utils";
import { useHistory } from "react-router";
import { getOccuranceByDate } from "utils/db.utils";

const today = dayjs();
const todayString = dayjs().format(DATE_FORMAT);
const todayMonth = dayjs().format("MMMM YYYY");

export function MonthViewPage({ day }: { day: string }) {
  const history = useHistory();
  const currentMonth = dayjs(day).format("MMMM YYYY");
  const currentDate = dayjs(day);
  const { occuranceList, seriesMap } = useData();

  const [occuranceMap, setOccuranceMap] = useState(new Map<string, Occurance[]>());

  const fillOccuranceMap = async () => {
    const map = new Map<string, Occurance[]>();

    const daysArr = [];
    for (let i = 0; i < currentDate.daysInMonth(); i++) {
      daysArr.push(currentDate.add(i, "day").format(DATE_FORMAT));
    }

    for await (const d of daysArr) {
      const objects = await getOccuranceByDate(d);
      map.set(d, objects);
    }

    setOccuranceMap(map);
  };

  useEffect(() => {
    setOccuranceMap(new Map<string, Occurance[]>());
    // const map = new Map<string, Occurance>();
    fillOccuranceMap();
  }, [day, occuranceList]);

  const calendarData = useMemo(() => {
    const year = currentDate.year();
    const month = currentDate.month();

    // Get the first day of the month
    const firstDayOfMonth = dayjs(`${year}-${month + 1}-01`);

    // Find the start of the week (Sunday is 0, Monday is 1, etc., but we need the day of the week for alignment)
    const startDayOfWeek = firstDayOfMonth.day(); // 0 for Sunday, 1 for Monday...

    // Determine the number of days in the month
    const daysInMonth = dayjs(`${year}-${month + 1}-01`)
      .add(1, "month")
      .diff(firstDayOfMonth, "day");

    // Calculate the days for the grid
    const days = [];

    // Determine the number of leading empty cells needed for alignment
    // (The first day of the month needs to be shifted based on where the week starts)
    const leadingEmptyCells = startDayOfWeek;

    // Generate all days
    for (let i = 0; i < daysInMonth; i++) {
      const day = firstDayOfMonth.add(i, "day");

      // Determine if we need to add an empty placeholder cell for alignment
      const isLeadingEmpty = i < leadingEmptyCells;

      days.push({
        date: day.format(DATE_FORMAT),
        value: day.format("D"), // Display the day number
        isLeadingEmpty: isLeadingEmpty,
      });
    }

    return {
      daysInMonth,
      startDayOfWeek,
      days,
    };
  }, [currentDate]);

  // console.log("==OCCURANCEMAP", occuranceMap);

  return (
    <main>
      <section className="hflex" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <button
          className="changeViewButton outline"
          data-tooltip="Previous day"
          onClick={() =>
            history.push(`/month/${dayjs(day).subtract(1, "month").format(DATE_FORMAT)}`)
          }
        >
          {"<"}
        </button>
        <h4>
          {currentMonth} {currentMonth === todayMonth && "(Current month)"}
        </h4>
        <button
          className="changeViewButton outline"
          data-tooltip="Previous day"
          onClick={() => history.push(`/month/${dayjs(day).add(1, "month").format(DATE_FORMAT)}`)}
        >
          {">"}
        </button>
      </section>

      <div className="calendar-grid">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* Calendar Cells */}
        {/* Render leading empty cells */}
        {[...Array(calendarData.startDayOfWeek)].map((_, index) => (
          <div key={`empty-${index}`} className="calendar-cell empty-leading"></div>
        ))}

        {/* Render actual days */}
        {calendarData.days.map((dayInfo, index) => (
          <div
            key={index}
            className={`calendar-cell ${dayInfo.isLeadingEmpty ? "empty-leading" : ""}`}
            onClick={() => history.push(`/day/${dayInfo.date}`)}
          >
            <span className="monthDayTitle">{dayInfo.value}</span>
            <span className="vflex" style={{ gap: "1px" }}>
              {occuranceMap.get(dayInfo.date)?.map((item) => {
                const color = stringToColour(item.seriesId) ?? "#000";

                return (
                  <span
                    key={item.id}
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
        ))}
      </div>
    </main>
  );
}
