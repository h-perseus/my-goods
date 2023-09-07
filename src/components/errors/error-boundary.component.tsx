import { ReactNode } from "react";

import { StatusCodes } from "http-status-codes";
import { ErrorBoundary as Boundary, FallbackProps } from "react-error-boundary";

import { ErrorScreen } from "./general-error-screen/general-error-screen.component";
import { ServiceUnavailable } from "./service-unavailable/service-unavailable.component";
import { UnauthenticatedUser } from "./unauthenticated-user/unauthenticated-user.component";

const ErrorFallback = ({ error }: FallbackProps) => {
  const errorType = Number(error.message);

  switch (errorType) {
    case StatusCodes.SERVICE_UNAVAILABLE:
    case StatusCodes.TOO_MANY_REQUESTS:
      return <ServiceUnavailable />;
    case StatusCodes.UNAUTHORIZED:
      return <UnauthenticatedUser />;
    default:
      return <ErrorScreen errorDescription={error.message} />;
  }
};

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary = ({
  children,
}: ErrorBoundaryProps): JSX.Element => {
  return <Boundary FallbackComponent={ErrorFallback}>{children}</Boundary>;
};
