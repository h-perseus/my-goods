
import { useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Connection } from '../connection.interface';
import QUERY_KEYS from '../../query-keys';
import { useApplicationServices } from '../../../components/providers/application-services-provider.component';

interface UseConnectionsProps {
  searchOptions: any;
}

interface UseConnections {
  connections: Connection[];
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useConnections = ({
  searchOptions
}: UseConnectionsProps): UseConnections => {

  const { connectionService: service} = useApplicationServices()

  const query = useInfiniteQuery<Connection[]>({
    queryKey: QUERY_KEYS.CONNECTION_LIST_KEY(searchOptions),
    queryFn: async () => {
      return await service.list(searchOptions);
    },
  });
  
  const { isLoading, isFetching, refetch, error, data } = query;

  const connections =
  data?.pages?.flatMap((response: Connection[]) => response) ?? [];
  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { connections, isInProgress, load, error };
};
