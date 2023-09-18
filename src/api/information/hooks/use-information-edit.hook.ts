import { useCallback, useState } from "react";
import { Information } from "../information.interface";
import { useNotification } from "../../../components/shared/notification/notification.component";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";
import { NOTIFICATION_TYPE } from "../../../components/shared/notification/notification-toast/notification-type.enum";

interface UseInformationEdit {
  edit: (args: Partial<Information>) => Promise<any>;
  isInProgress: boolean;
}
export const useInformationEdit = (): UseInformationEdit => {
  const [isInProgress, setInProgress] = useState<boolean>(false);
  const { addNotification } = useNotification();
  const { informationService: service } = useApplicationServices();

  const edit = useCallback(
    async (args: Partial<Information>): Promise<any> => {
      setInProgress(true);
      await service.edit(args).catch((error: any) => {
        setInProgress(false);

        addNotification(error?.message, NOTIFICATION_TYPE.ERROR);
        throw error;
      });
      setInProgress(false);
    },
    [service],
  );

  return { edit, isInProgress };
};
