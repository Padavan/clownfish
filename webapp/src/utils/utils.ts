import dayjs, { Dayjs } from "dayjs";
import { Occurance, Series, Strategy } from "./series.types";

export const getDateString = (isoString: string) => isoString.split("T")[0];

export const DATE_FORMAT = "YYYY-MM-DD";

export const formatDate = (date: Dayjs) => {
  return date.format("YYYY-MM-DD");
};

// get fibonacci events that fall into interval
export const getFibonacciInRange = ({
  startDate,
  startInterval,
  endInterval,
}: {
  startDate: string;
  startInterval: string;
  endInterval: string;
}) => {
  const initial = dayjs(startDate);
  const start = dayjs(startInterval);
  const end = dayjs(endInterval);

  const fibs = [];
  let a = 0;
  let b = 1;
  let counter = 1;
  while (a <= end.diff(initial, "day")) {
    if (a >= initial.diff(start, "day")) {
      fibs.push({
        date: initial.add(a, "day").format(DATE_FORMAT),
        occurance: counter,
      });
    }
    a = b;
    b = a + b;
    counter++;
  }
  return fibs;
};

// get doubling events that fall into interval
export const getDoublingInRange = ({
  startDate,
  startInterval,
  endInterval,
}: {
  startDate: string;
  startInterval: string;
  endInterval: string;
}) => {
  const initial = dayjs(startDate);
  const start = dayjs(startInterval);
  const end = dayjs(endInterval);

  const fibs = [];
  let a = 0;
  let counter = 1;
  while (a <= end.diff(initial, "day")) {
    if (a >= initial.diff(start, "day")) {
      fibs.push({
        date: initial.add(a, "day").format(DATE_FORMAT),
        occurance: counter,
      });
    }
    if (a === 0) {
      a = 1;
    } else {
      a = a * 2;
    }
    counter++;
  }
  return fibs;
};

const pallette = [
  "rgb(153, 25, 25)",
  "rgb(164, 23, 82)",
  "rgb(100, 27, 163)",
  "rgb(12, 92, 114)",
  "rgb(23, 61, 166)",
  "rgb(12, 93, 86)",
  "rgb(17, 105, 50)",
  "rgb(253, 224, 71)",
  "rgb(249, 115, 22)",
];

export const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });

  console.log("MODULO", hash % pallette.length);

  return pallette[Math.abs(hash % pallette.length)];
};

export const generateEvents = (series: Series): Occurance[] => {
  const today = dayjs();
  const { startDate } = series;
  const startInterval = today.format(DATE_FORMAT);
  const endInterval = today.add(90, "day").format(DATE_FORMAT);

  if (series.strategy === Strategy.FIBONACCI) {
    console.log("1");
    const range = getFibonacciInRange({
      startDate,
      startInterval,
      endInterval,
    });
    console.log("range", range);
    return range.map((o) => ({
      id: `${series.id}-${o.occurance}`,
      date: o.date,
      seriesId: series.id,
      status: "pending",
      occurance: o.occurance,
      rate: -1,
    }));
  } else if (series.strategy === Strategy.DOUBLING) {
    // getDoublingInRange
    const range = getDoublingInRange({
      startDate,
      startInterval,
      endInterval,
    });
    console.log("range", range);
    return range.map((o) => ({
      id: `${series.id}-${o.occurance}`,
      date: o.date,
      seriesId: series.id,
      status: "pending",
      occurance: o.occurance,
      rate: -1,
    }));
  } else {
    return [];
  }
};

export const findNextOccurance = (list: Occurance[], target: Occurance): string | undefined => {
  const next = list.find((o) => o.id === `${target.seriesId}-${target.occurance + 1}`);

  if (next) {
    return next.date;
  } else {
    return undefined;
  }
};

export const getStripedBackground = (color: string) => {
  return `repeating-linear-gradient(
  -55deg,
  ${color},
  ${color} 10px,
  #white 10px,
  #white 20px
)`;
};
