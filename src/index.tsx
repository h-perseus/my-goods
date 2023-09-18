import ReactDOM from "react-dom/client";
import "./assets/index.scss";
import reportWebVitals from "./reportWebVitals";
import { lightTheme, Provider } from "@adobe/react-spectrum";
import { ErrorBoundary } from "./components/errors/error-boundary.component";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { NotificationProvider } from "./components/shared/notification/notification.component";
import App from "./components/app.component";
import { ApplicationServicesProvider } from "./components/providers/application-services-provider.component";
import { Buffer } from "buffer";
global.Buffer = Buffer;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <Provider theme={lightTheme} colorScheme="light">
    <ApplicationServicesProvider>
      <ErrorBoundary>
        <Router>
          <NotificationProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </NotificationProvider>
        </Router>
      </ErrorBoundary>
    </ApplicationServicesProvider>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
