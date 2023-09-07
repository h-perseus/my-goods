import { useCallback, useState } from 'react';
import { useApplicationServices } from '../../../components/providers/application-services-provider.component';
import { NOTIFICATION_TYPE } from '../../../components/shared/notification/notification-toast/notification-type.enum';
import { useNotification } from '../../../components/shared/notification/notification.component';

interface UseProductDelete {
  delete: (ids: string[]) => Promise<void>;
  isInProgress: boolean;
}
export const useProductDelete = (): UseProductDelete => {
  const [isInProgress, setInProgress] = useState<boolean>(false);
  const { productService: service } = useApplicationServices();
  const { addNotification } = useNotification();

  const _delete = useCallback(
    async (ids: string[]): Promise<void> => {
      for (const id of ids) {
        setInProgress(true);

        await service.destroy(id).catch((error: any) => {
          addNotification(error?.message, NOTIFICATION_TYPE.ERROR);
          setInProgress(false);
          throw error;
        });
      }
      setInProgress(false);
    },
    [service]
  );

  return { delete: _delete, isInProgress };
};
