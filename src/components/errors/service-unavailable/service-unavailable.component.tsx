import { Image, Content, Button } from "@adobe/react-spectrum";
import { Heading } from "@react-spectrum/text";

import ServiceUnavailableIcon from "../../../assets/images/service-unavailable.svg";
import { ErrorLayout } from "../error-layout";
import classes from "../error-layout/error-layout.module.scss";

export const ServiceUnavailable = (): JSX.Element => {
  const handleOnPress = (): void => {
    // hard refresh
    window.location.href = window.location.href;
  };

  return (
    <ErrorLayout>
      <Image
        order={1}
        src={ServiceUnavailableIcon}
        alt={"Service unavailable"}
      />
      <Heading data-testid={"server-connection-lost-id"}>
        Server connection lost
      </Heading>
      <Content UNSAFE_className={classes.errorMessage}>
        Please try again in a few minutes
      </Content>
      <Button variant={"cta"} marginTop={"size-200"} onPress={handleOnPress}>
        Connect
      </Button>
    </ErrorLayout>
  );
};
