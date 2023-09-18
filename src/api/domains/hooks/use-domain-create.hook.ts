import { useCallback, useState } from "react";
import { Domain } from "../domain.interface";
import { useNotification } from "../../../components/shared/notification/notification.component";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";
import { NOTIFICATION_TYPE } from "../../../components/shared/notification/notification-toast/notification-type.enum";

interface UseDomainCreate {
  create: (args: Partial<Domain>) => Promise<any>;
  isInProgress: boolean;
}
export const useDomainCreate = (): UseDomainCreate => {
  const [isInProgress, setInProgress] = useState<boolean>(false);
  const { addNotification } = useNotification();
  const { domainService: service } = useApplicationServices();

  const create = useCallback(
    async (args: Partial<Domain>): Promise<any> => {
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
