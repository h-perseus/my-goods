import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { LOCAL_STORAGE_KEYS } from '../helpers/local-storage-keys';
import { removeLocalStorageKey } from '../helpers/utils';

export const NETWORK_ERROR_MESSAGE =
  'Network error: Please check your connection and try again';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || `/api/`,
});

const SERVER_IS_UNAVAILABLE_STATUS_CODES = [
  StatusCodes.SERVICE_UNAVAILABLE,
  StatusCodes.TOO_MANY_REQUESTS,
];

instance.interceptors.response.use(
  (response) => {
    if (
      response.headers['content-type']?.includes('text/html') &&
      response.request?.responseURL?.includes('/dex/auth/')
    ) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.UNAUTHORIZED, 'true');
      window.dispatchEvent(new Event('storage'));

      return Promise.reject(response);
    } else {
      removeLocalStorageKey(LOCAL_STORAGE_KEYS.UNAUTHORIZED);
    }

    return response;
  },
  (error) => {
    const statusCode = error?.response?.status ?? '';
    const message = error?.response?.data?.message || error?.response?.data;

    if (SERVER_IS_UNAVAILABLE_STATUS_CODES.includes(statusCode)) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SERVICE_UNAVAILABLE, 'true');
      window.dispatchEvent(new Event('storage'));

      return;
    }

    if (message && typeof message === 'string') {
      error.message = statusCode
        ? `Request failed with status code ${statusCode}: ${message}`
        : `Error: ${message}`;
    } else {
      // In case of a client error response (400-499), we need to show a specific message
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
      const clientError =
        statusCode >= StatusCodes.BAD_REQUEST &&
        statusCode < StatusCodes.INTERNAL_SERVER_ERROR;

      if (clientError && error.response.data.detail) {
        error.message = error.response.data.detail['errorMessage'];
      } else {
        // If there is no response, then the `message` will be `null`, and `as per axios design,
        // the default error is a network error
        error.message = NETWORK_ERROR_MESSAGE;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
