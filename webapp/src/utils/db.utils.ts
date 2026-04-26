export enum Stores {
  Series = "Series",
  Occurances = "Occurances",
}

const VERSION = 1;
const DB_NAME = "UsersDB";

export const initDB = (): Promise<boolean> => {
  let request: IDBOpenDBRequest;
  let db: IDBDatabase;

  return new Promise((resolve) => {
    // open the connection
    console.log("initdb");
    request = indexedDB.open(DB_NAME);
    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (
        !db.objectStoreNames.contains(Stores.Series) ||
        !db.objectStoreNames.contains(Stores.Occurances)
      ) {
        console.log("Creating Series store");

        const seriesStore = db.createObjectStore(Stores.Series, { keyPath: "id" });
        // seriesStore.createIndex("name", "name", { unique: false });
        // seriesStore.createIndex("description", "description", { unique: false });
        // seriesStore.createIndex("startDate", "startDate", { unique: false });
        // seriesStore.createIndex("strategy", "strategy", { unique: false });
        // seriesStore.createIndex("hlc", "hlc", { unique: false });

        // Define the structure of the highlights object store based on the IHighlight interface
        const highlightsStore = db.createObjectStore(Stores.Occurances, { keyPath: "id" });
        // highlightsStore.createIndex("date", "date", { unique: false });
        // highlightsStore.createIndex("seriesId", "seriesId", { unique: false });
        // highlightsStore.createIndex("status", "status", { unique: false });
        // highlightsStore.createIndex("occurance", "occurance", { unique: false });
        // highlightsStore.createIndex("rate", "rate", { unique: false });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      // version = db.version;
      console.log("request.onsuccess - initDB", 1);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addData = <T>(storeName: string, data: T): Promise<T | string | null> => {
  let request: IDBOpenDBRequest;
  let db: IDBDatabase;

  return new Promise((resolve) => {
    request = indexedDB.open(DB_NAME, VERSION);

    request.onsuccess = () => {
      console.log("request.onsuccess - addData", storeName, data);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.add(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};

export const putData = <T>(storeName: string, data: T): Promise<T | string | null> => {
  let request: IDBOpenDBRequest;
  let db: IDBDatabase;

  return new Promise((resolve) => {
    request = indexedDB.open(DB_NAME, VERSION);

    request.onsuccess = () => {
      console.log("request.onsuccess - putData", storeName, data);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.put(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};

export const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
  let request: IDBOpenDBRequest;
  let db: IDBDatabase;

  return new Promise((resolve) => {
    request = indexedDB.open(DB_NAME);

    request.onsuccess = () => {
      console.log("request.onsuccess - getAllData");
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
};
