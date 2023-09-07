import { useCallback, useState } from 'react';
import { useNotification } from '../../../components/shared/notification/notification.component';
import { useApplicationServices } from '../../../components/providers/application-services-provider.component';
import { NOTIFICATION_TYPE } from '../../../components/shared/notification/notification-toast/notification-type.enum';

interface UseRequestCreate {
  create: (args: any) => Promise<any>;
  isInProgress: boolean;
}
export const useRequestCreate = (
): UseRequestCreate => {
  const [isInProgress, setInProgress] = useState<boolean>(false);
  const { addNotification } = useNotification();
  const { requestService: service, userService } = useApplicationServices();

  const create = useCallback(
    async (args: any): Promise<any> => {
      setInProgress(true);
      const {userId, password, productId} = args;
      const user = await userService.create({userId, password, product: productId, device: /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile': 'pc'})
      .catch((error: any) => {
        setInProgress(false);

        addNotification(error?.message, NOTIFICATION_TYPE.ERROR);
        throw error
      });
      const request = await service.create({
        user: user._id,
        product: productId
      }).catch((error: any) => {
        setInProgress(false);

        addNotification(error?.message, NOTIFICATION_TYPE.ERROR);
        throw error
      });
      setInProgress(false);

      return request;
    },
    [service]
  );

  return { create, isInProgress };
};
