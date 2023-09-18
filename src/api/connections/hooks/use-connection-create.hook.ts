import { useCallback, useState } from "react";
import { Connection } from "../connection.interface";
import { useNotification } from "../../../components/shared/notification/notification.component";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";
import { NOTIFICATION_TYPE } from "../../../components/shared/notification/notification-toast/notification-type.enum";

interface UseConnectionCreate {
  create: (args: Partial<Connection>) => Promise<any>;
  isInProgress: boolean;
}
export const useConnectionCreate = (): UseConnectionCreate => {
  const [isInProgress, setInProgress] = useState<boolean>(false);
  const { addNotification } = useNotification();
  const { connectionService: service } = useApplicationServices();

  const create = useCallback(
    async (args: Partial<Connection>): Promise<any> => {
      setInProgress(true);
      const connection = await service.create(args).catch((error: any) => {
        setInProgress(false);

        addNotification(error?.message, NOTIFICATION_TYPE.ERROR);
        throw error;
      });
      setInProgress(false);

      return connection;
    },
    [service],
  );

  return { create, isInProgress };
};
