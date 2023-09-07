import { AxiosRequestConfig, AxiosResponse } from "axios";
import { setLogger } from "react-query";
import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTER_PATHS } from "../routes";
import { useStorage } from "../hooks/use-storage";
import AdminLandingPage from "./pages/admin/landing-page.component";
import LandingPage from "./pages/client/landing-page.component";
import LoginPage from "./pages/login.component";

interface ResponseError {
  message: string;
  name: string;
  stack: string;
  config: AxiosRequestConfig;
  response: AxiosResponse;
}

const App = (): JSX.Element => {
  useStorage();

  setLogger({
    // eslint-disable-next-line no-console
    log: (log: string) => console.log(log),
    // eslint-disable-next-line no-console
    warn: (warn: string) => console.warn(warn),
    error: (error: ResponseError) => {
      if (
        error.hasOwnProperty("message") &&
        error.hasOwnProperty("config") &&
        error.hasOwnProperty("response")
      ) {
        const errorLog = `Error: '${error.message}'`;
        const urlLog = `Request url: '${error.config.url}'`;
        const requestBody = `Request body: ${
          error.config ? error.config.data : undefined
        }`;
        const responseBody = `Response body: ${
          error.response ? JSON.stringify(error.response.data) : undefined
        }`;
        // eslint-disable-next-line no-console
        console.error(
          `${errorLog}, ${urlLog}, ${requestBody}, ${responseBody}`,
        );
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  });

  return (
    <>
      <Routes>
        <Route
          path={ROUTER_PATHS.ADMIN + "*"}
          element={<AdminLandingPage />}
        />
         <Route
          path={"*"}
          element={<LandingPage />}
        />
        <Route
          path={"/login"}
          element={<LoginPage />}
        />
        <Route
          path="*"
          element={<Navigate to={ROUTER_PATHS.ADMIN} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
