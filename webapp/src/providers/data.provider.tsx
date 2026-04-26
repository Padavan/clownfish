import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import { Occurance, Series, Strategy } from "utils/series.types";
import { hClock } from "utils/hlc";
import { generateEvents } from "utils/utils";
import { addData, getStoreData, initDB, putData, Stores } from "utils/db.utils";

// const testSeries: Series = {
//   id: "1",
//   name: "test",
//   description: "testDecription",
//   startDate: "2026-04-25",
//   strategy: Strategy.FIBONACCI,
//   hlc: hClock.next(),
// };

const testSeries: Series = {
  id: "3",
  name: "test3",
  description: "OLASODLAJSDKLF: AJS:LD KAJS:L DKJAS:L KDJA:SLKD J:ALKSJD :LKAS",
  startDate: "2026-04-26",
  strategy: Strategy.DOUBLING,
  hlc: hClock.next(),
};

type DataContextType = {
  seriesMap: Map<string, Series>;
  occuranceList: Occurance[];
  createNewSeries: (target: Series) => Promise<void>;
  patchOccurance: (target: Occurance) => Promise<void>;
};

const DataContext = React.createContext<DataContextType>({
  seriesMap: new Map<string, Series>(),
  occuranceList: [],
  createNewSeries: async () => {},
  patchOccurance: async () => {},
});

const DataProvider = (props: PropsWithChildren) => {
  const [dbStatus, setDBStatus] = useState(false);
  const [seriesMap, setSeriesMap] = useState(new Map<string, Series>());
  const [occuranceList, setOccuranceList] = useState<Occurance[]>([]);

  const updateSeries = async () => {
    const list = await getStoreData<Series>(Stores.Series);
    const map = new Map<string, Series>();
    for (const s of list) {
      map.set(s.id, s);
    }
    setSeriesMap(map);
  };

  const getOccuranceList = async () => {
    const list = await getStoreData<Occurance>(Stores.Occurances);
    setOccuranceList(list);
  };

  const doDb = async () => {
    if (!dbStatus) {
      // console.log("initdb");
      const db = await initDB();
      // mock
      await addData(Stores.Series, testSeries);
      setDBStatus(db);
      updateSeries();
    }
  };
  useEffect(() => {
    doDb();
  }, []);

  const updateOccurances = async () => {
    const occurances = Array.from(seriesMap.values()).flatMap((s) => generateEvents(s));

    for await (const occ of occurances) {
      await addData(Stores.Occurances, occ);
    }
    await getOccuranceList();
  };

  useEffect(() => {
    if (seriesMap.size > 0) {
      updateOccurances();
    }
  }, [seriesMap]);

  const patchOccurance = async (target: Occurance) => {
    await putData(Stores.Occurances, target);
    await getOccuranceList();
  };

  const createNewSeries = async (target: Series) => {
    await addData(Stores.Series, target);
    await updateSeries();
    await updateOccurances();
  };

  console.log("map", seriesMap);

  return (
    <DataContext.Provider
      value={{
        seriesMap,
        createNewSeries,
        occuranceList,
        patchOccurance,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext);

export { DataContext, DataProvider, useData };
