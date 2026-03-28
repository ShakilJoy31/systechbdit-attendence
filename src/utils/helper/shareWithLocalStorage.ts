import { appConfiguration } from "../constant/appConfiguration";

interface ILocalStorageDataProps {
  sidebar?: string;
  route?: string;
  activeAccountTab?: string;
  // Add other known keys here as needed
}

type StorageKey = keyof ILocalStorageDataProps;
type StorageValue = string | undefined;

export const shareWithLocal = <K extends StorageKey>(
  option: "set" | "get" | "remove",
  key: K,
  value?: ILocalStorageDataProps[K]
): StorageValue => {
  const storageKey = appConfiguration.appCode;

  // RETRIEVE THE EXISTING DATA OBJECT FROM LOCAL STORAGE
  const storedData = localStorage.getItem(storageKey);
  const dataObject: ILocalStorageDataProps = storedData
    ? JSON.parse(storedData)
    : {};

  if (option === "set") {
    if (value === undefined) {
      throw new Error("Value must be provided for 'set' operation");
    }
    // ADD OR UPDATE THE KEY-VALUE PAIR
    dataObject[key] = value;
    localStorage.setItem(storageKey, JSON.stringify(dataObject));
    return;
  }

  if (option === "get") {
    return dataObject[key] ?? undefined;
  }

  if (option === "remove") {
    delete dataObject[key]; // REMOVE THE KEY-VALUE PAIR
    localStorage.setItem(storageKey, JSON.stringify(dataObject));
    return;
  }

  // This ensures all code paths return a value
  return undefined;
};