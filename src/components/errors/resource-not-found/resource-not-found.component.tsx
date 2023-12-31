import { Content, Button } from "@adobe/react-spectrum";
import { Heading } from "@react-spectrum/text";

import { EmptyModels } from "../../../assets/images";
import { ErrorLayout } from "../error-layout";
import classes from "../error-layout/error-layout.module.scss";

export const Notfound = (): JSX.Element => {
  const handleOnPress = (): void => {
    // hard refresh
    window.location.href = window.location.href;
  };

  return (
    <ErrorLayout>
      <EmptyModels aria-label={"Resource unavailable"} />
      <Heading data-testid={"server-connection-lost-id"}>
        Resource not found
      </Heading>
      <Content UNSAFE_className={classes.errorMessage}>
        Please try refreshing the page
      </Content>
      <Button variant={"cta"} marginTop={"size-200"} onPress={handleOnPress}>
        Refresh
      </Button>
    </ErrorLayout>
  );
};
