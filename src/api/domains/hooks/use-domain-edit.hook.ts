import { useCallback, useState } from "react";
import { Domain } from "../domain.interface";
import { useNotification } from "../../../components/shared/notification/notification.component";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";
import { NOTIFICATION_TYPE } from "../../../components/shared/notification/notification-toast/notification-type.enum";

interface UseDomainEdit {
  edit: (id: string, args: Partial<Domain>) => Promise<any>;
  isInProgress: boolean;
}
export const useDomainEdit = (): UseDomainEdit => {
  const [isInProgress, setInProgress] = useState<boolean>(false);
  const { addNotification } = useNotification();
  const { domainService: service } = useApplicationServices();

  const edit = useCallback(
    async (id: string, args: Partial<Domain>): Promise<any> => {
      setInProgress(true);
      await service.edit(id, args).catch((error: any) => {
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
