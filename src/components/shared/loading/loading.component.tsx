import { LoadingIndicator } from "./loading-indicator.component";

interface LoadingProps extends Partial<any> {
  overlay?: boolean;
}

export const Loading = ({
  overlay = false,
  ...rest
}: LoadingProps): JSX.Element => {
  return <LoadingIndicator {...rest} />;
};
