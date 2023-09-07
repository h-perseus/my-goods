import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  ReactNotifications,
  iNotificationDismiss,
  Store,
} from "react-notifications-component";
import { useLocation } from "react-router-dom";
import { MissingProviderError } from "../../../helpers/missing-provider-error";

import { NOTIFICATION_TYPE, NotificationToast } from "./notification-toast";
import classes from "./notification.module.scss";

interface NotificationContextProps {
  addNotification: (
    message: any | string,
    type: NOTIFICATION_TYPE,
    dismiss?: iNotificationDismiss,
  ) => void;
}

interface NotificationProviderProps {
  children: JSX.Element;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

const defaultDismiss = {
  duration: 0,
  onScreen: false,
  pauseOnHover: true,
  click: false,
  showIcon: true,
};

export const NotificationProvider = ({
  children,
}: NotificationProviderProps): JSX.Element => {
  const notificationsIds = useRef<string[]>([]);
  const location = useLocation();

  const addNotification = useCallback(
    (
      message: string,
      type: NOTIFICATION_TYPE,
      dismiss: iNotificationDismiss = defaultDismiss,
    ): void => {
      if (typeof message === "object") {
        message = JSON.stringify(message);
      }
      const notificationId = `${message}-${Date.now()}`;

      const isActiveNotification = notificationsIds.current.find(
        (notification) => notification.includes(message),
      );

      if (isActiveNotification) {
        return;
      }

      notificationsIds.current.push(notificationId);

      Store.addNotification({
        id: notificationId,
        content: (
          <NotificationToast
            message={message}
            type={type}
            remove={() => removeNotification(notificationId)}
          />
        ),
        insert: "top",
        container: "bottom-full",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss,
      });
    },
    [],
  );

  const removeNotification = (id: string) => {
    notificationsIds.current = [...notificationsIds.current].filter(
      (notificationId: string) => notificationId !== id,
    );

    Store.removeNotification(id);
  };

  const removeNotifications = () => {
    notificationsIds.current.forEach((notificationsId: string) => {
      Store.removeNotification(notificationsId);
    });

    notificationsIds.current = [];
  };

  useEffect(() => {
    removeNotifications();
  }, [location]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      <ReactNotifications
        className={classes.notificationContainer}
        isMobile
        breakpoint={1024}
      />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new MissingProviderError("useNotification", "NotificationProvider");
  }

  return context;
};
