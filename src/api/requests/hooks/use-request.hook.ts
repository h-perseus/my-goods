
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Request } from '../request.interface';
import QUERY_KEYS from '../../query-keys';
import { useApplicationServices } from '../../../components/providers/application-services-provider.component';

interface UseRequestProps {
  id: string;
}

interface UseRequest {
  request: Request | undefined;
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useRequest = ({
  id
}: UseRequestProps): UseRequest => {

  const { requestService: service} = useApplicationServices()

  const query = useQuery<Request>({
    queryKey: QUERY_KEYS.REQUEST_KEY(id),
    queryFn: async () => {
      if (id === '') return undefined;
      return await service.get(id);
    },
  });
  
  const { isLoading, isFetching, refetch, error, data } = query;

  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { request: data, isInProgress, load, error };
};
