import { useEffect } from "react";

import { StatusCodes } from "http-status-codes";
import { useErrorBoundary } from "react-error-boundary";
import { LOCAL_STORAGE_KEYS } from "../helpers/local-storage-keys";
import { removeLocalStorageKey } from "../helpers/utils";

export const useStorage = (): void => {
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const listenerCallback = () => {
      if (localStorage.getItem(LOCAL_STORAGE_KEYS.UNAUTHORIZED) === "true") {
        showBoundary({ message: StatusCodes.UNAUTHORIZED });
        removeLocalStorageKey(LOCAL_STORAGE_KEYS.UNAUTHORIZED);
      }
    };

    window.addEventListener("storage", listenerCallback);

    return () => {
      window.removeEventListener("storage", listenerCallback);
    };
  }, [showBoundary]);
};
