import { Heading, Button, Text } from "@adobe/react-spectrum";
import { ROUTER_PATHS } from "../../../routes";

import { ErrorLayout } from "../error-layout";
import classes from "../error-layout/error-layout.module.scss";

/* eslint-disable max-len */

export const UnauthenticatedUser = (): JSX.Element => {
  const handleOnPress = (): void => {
    window.location.href = ROUTER_PATHS.HOME;
  };

  // eslint-disable-max-len
  return (
    <ErrorLayout>
      <div style={{ order: 1 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="128"
          width="128"
          viewBox="0 0 128 128"
        >
          <g>
            <path
              id="path1"
              transform="rotate(0,64,64) translate(1.6,16.794451713562) scale(3.9,3.9) "
              fill="#6B6E76"
              d="M18.6,19.799619C18.1,19.799619 17.699999,20.199611 17.699999,20.699602 17.699999,21.199592 18.1,21.699582 18.6,21.699582 19.1,21.699582 19.6,21.29959 19.6,20.7996 19.6,20.299609 19.199999,19.899617 18.6,19.799619z M20.6,17.199669C22.099999,17.199669,23.199999,18.099651,23.8,19.19963L24.8,19.19963C24.8,19.19963,24.9,19.299628,25.099999,19.499625L31.3,19.699621 32,20.399607 30.8,21.499586 26.699999,21.399588C26.099999,21.699582,25.5,22.499567,25.5,22.499567L23.599999,22.399569C23,23.499548 21.8,24.299532 20.4,24.199534 18.4,24.099536 16.9,22.499567 16.9,20.499605 17.1,18.69964 18.699999,17.199669 20.6,17.199669z M0,9.4998169L27.9,9.4998169 27.9,18.299648 25.8,18.19965 25.599999,17.899655 24.599999,17.899655C23.699999,16.699678,22.3,15.899694,20.699999,15.799695L20.5,15.799695C17.8,15.799696 15.6,17.899655 15.5,20.699602 15.5,21.199592 15.5,21.699582 15.699999,22.199573L15.699999,22.299571 0,22.299571z M0,0L11.2,0 11.2,2.8999443 27.9,2.8999443 27.9,6.3998766 0,6.3998766 0,3.3999338 0,2.8999443z"
            />
          </g>
        </svg>
      </div>
      <Heading UNSAFE_className={classes.errorCodeText} marginTop={"size-200"}>
        Unauthenticated
      </Heading>
      <Text UNSAFE_className={classes.errorMessage} marginY={"size-200"}>
        Session expired, you probably have logged on other device.
      </Text>
      <Button variant={"cta"} onPress={handleOnPress}>
        Sign in
      </Button>
    </ErrorLayout>
  );
};
