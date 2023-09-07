import { Heading, Link } from "@adobe/react-spectrum";
import CloudErrorIcon from "@spectrum-icons/workflow/CloudError";

import { ErrorLayout } from "../error-layout";
import classes from "../error-layout/error-layout.module.scss";

export const ErrorScreen = ({
  errorDescription,
}: {
  errorDescription: string;
}): JSX.Element => {
  const handleOnPress = (): void => {
    // hard refresh
    window.location.href = window.location.href;
  };

  return (
    <ErrorLayout>
      <CloudErrorIcon size="XXL" />
      <Heading UNSAFE_className={classes.errorMessage}>
        An error occured...please try{" "}
        <Link variant="overBackground" onPress={handleOnPress}>
          refreshing
        </Link>{" "}
        the page
      </Heading>
      <Heading id="error-description" UNSAFE_className={classes.errorMessage}>
        Error: {errorDescription}
      </Heading>
    </ErrorLayout>
  );
};
