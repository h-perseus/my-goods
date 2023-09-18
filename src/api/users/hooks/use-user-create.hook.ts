import { useCallback, useState } from "react";
import { User } from "../user.interface";
import { useNotification } from "../../../components/shared/notification/notification.component";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";
import { NOTIFICATION_TYPE } from "../../../components/shared/notification/notification-toast/notification-type.enum";

interface UseUserCreate {
  create: (args: Partial<User>) => Promise<any>;
  isInProgress: boolean;
}
export const useUserCreate = (): UseUserCreate => {
  const [isInProgress, setInProgress] = useState<boolean>(false);
  const { addNotification } = useNotification();
  const { userService: service } = useApplicationServices();

  const create = useCallback(
    async (args: Partial<User>): Promise<any> => {
      setInProgress(true);
      await service.create(args).catch((error: any) => {
        setInProgress(false);

        addNotification(error?.message, NOTIFICATION_TYPE.ERROR);
        throw error;
      });
      setInProgress(false);
    },
    [service],
  );

  return { create, isInProgress };
};
