
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Information } from '../information.interface';
import QUERY_KEYS from '../../query-keys';
import { useApplicationServices } from '../../../components/providers/application-services-provider.component';

interface UseInformation {
  information: Information | undefined;
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useInformation = (): UseInformation => {

  const { informationService: service} = useApplicationServices()

  const query = useQuery<Information>({
    queryKey: QUERY_KEYS.INFORMATION_KEY(),
    queryFn: async () => {
      return await service.get();
    },
  });
  
  const { isLoading, isFetching, refetch, error, data } = query;

  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { information: data, isInProgress, load, error };
};
