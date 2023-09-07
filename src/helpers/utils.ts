import { LOCAL_STORAGE_KEYS } from "./local-storage-keys";
import { isEmpty as _isEmpty } from "lodash";

export enum ErrorBackendMessage {
  BAD_REQUEST = "BAD_REQUEST",
}

export enum ErrorFrontMessage {
  BAD_REQUEST = "Bad Request",
}

export const getDefinedFromList = <T>(items: (T | undefined)[]): T[] => {
  const isUndefined = (item: T | undefined): item is T => {
    return !!item;
  };
  return items.filter(isUndefined);
};

const sort = <T, K extends keyof T>(
  list: T[],
  attribute: K,
  toLowercase = false,
  ascending = true,
): T[] => {
  return [
    ...list.sort((previous: T, current: T): number => {
      let previousValue: any = previous[attribute],
        currentValue: any = current[attribute];
      let comparison: any;
      if (typeof previous[attribute] === "string" && toLowercase) {
        previousValue = (
          previous[attribute] as unknown as string
        ).toLowerCase();
        currentValue = (current[attribute] as unknown as string).toLowerCase();
        comparison = previousValue.localeCompare(currentValue);
      } else {
        comparison = previousValue < currentValue ? -1 : 1;
      }
      return ascending ? comparison : comparison <= 0 ? 1 : -1;
    }),
  ];
};

export const sortAscending = <T, K extends keyof T>(
  list: T[],
  attribute: K,
  toLowercase = false,
): T[] => {
  return sort(list, attribute, toLowercase);
};

export const sortDescending = <T, K extends keyof T>(
  list: T[],
  attribute: K,
  toLowercase = false,
): T[] => {
  return sort(list, attribute, toLowercase, false);
};

export const capitalize = (value: string): string =>
  `${value.charAt(0).toUpperCase()}${value.slice(1).toLocaleLowerCase()}`;

export const encodeToBase64 = (password: string): string => {
  return btoa(password);
};

export const errorMessageMapping = (message: ErrorBackendMessage): string => {
  switch (message) {
    case ErrorBackendMessage.BAD_REQUEST:
      return ErrorFrontMessage.BAD_REQUEST;
    default:
      return message;
  }
};

export const runWhen =
  <T>(predicate: (...args: T[]) => boolean) =>
  (whenTrueFn: (...args: T[]) => void) =>
  (...args: T[]): void => {
    if (predicate(...args)) {
      whenTrueFn(...args);
    }
  };

export const openNewTab = (url: string): void => {
  window.open(url, "_blank", "noreferrer");
};

export const removeLocalStorageKey = (key: LOCAL_STORAGE_KEYS): void => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
  }
};

export const getParsedLocalStorage = <T>(key: LOCAL_STORAGE_KEYS): T | null => {
  if (Boolean(localStorage.getItem(key))) {
    return JSON.parse(localStorage.getItem(key) as string) as T;
  }

  return null;
};

export const idMatchingFormat = (text: string | number): string => {
  if (typeof text === "string") {
    return text.split(" ").join("-").replace(",", "").toLowerCase();
  }
  return String(text);
};

export const isEmpty = (obj: any): boolean => {
  if (_isEmpty(obj)) return true;
  for (var prop in obj) {
    if (!_isEmpty(obj[prop])) return false;
  }
  return true;
};
