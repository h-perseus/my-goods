import { ActionButton, Flex, Text, View } from "@adobe/react-spectrum";

import "@spectrum-css/toast/dist/index-vars.css";
import { CloseSmall } from "../../../../assets/icons";
import classes from "./notification-toast.module.scss";
import { NOTIFICATION_TYPE } from "./notification-type.enum";
import { getIcon, getTypeToastClass } from "./utils";

interface NotificationToastProps {
  message: string;
  type: NOTIFICATION_TYPE;
  remove: () => void;
}

export const NotificationToast = ({
  message,
  type,
  remove,
}: NotificationToastProps): JSX.Element => {
  const isWarning = type === NOTIFICATION_TYPE.WARNING;

  return (
    <View width={"100%"} paddingTop={"size-150"}>
      <div
        className={`spectrum-Toast ${getTypeToastClass(type, classes)} ${
          classes.toast
        }`}
      >
        <div className="spectrum-Toast-body">
          <div
            className={`spectrum-Toast-content ${
              isWarning ? classes["spectrum-Toast-content--warning"] : ""
            }`}
          >
            <Flex columnGap={"size-100"} alignItems={"center"}>
              {getIcon(type)}
              <Text id="notification-msg-id">{message}</Text>
            </Flex>
          </div>
        </div>
        <div
          className={`spectrum-Toast-buttons ${
            isWarning ? classes["spectrum-Toast-buttons--warning"] : ""
          }`}
          aria-label="close-notification"
          role="button"
        >
          <ActionButton isQuiet onPress={remove}>
            <CloseSmall
              aria-label="close-notification-icon"
              className={
                isWarning ? classes["close-notification-icon--warning"] : ""
              }
            />
          </ActionButton>
        </div>
      </div>
    </View>
  );
};
