import { Alert, Info } from "../../../../assets/icons";
import { NOTIFICATION_TYPE } from "./";

export const getTypeToastClass = (
  type: NOTIFICATION_TYPE,
  classes?: { readonly [key: string]: string },
): string => {
  switch (type) {
    case NOTIFICATION_TYPE.ERROR:
      return "spectrum-Toast--negative";
    case NOTIFICATION_TYPE.INFO:
      return "spectrum-Toast--info";
    case NOTIFICATION_TYPE.WARNING:
      return classes
        ? classes["spectrum-Toast--warning"]
        : "spectrum-Toast--warning";
    default:
      return "";
  }
};

export const getIcon = (type: NOTIFICATION_TYPE): JSX.Element => {
  switch (type) {
    case NOTIFICATION_TYPE.ERROR:
      return <Alert />;
    case NOTIFICATION_TYPE.INFO:
      return <Info />;
    default:
      return <></>;
  }
};
