import { useCallback } from "react";
import { useQuery } from "react-query";
import { Connection } from "../connection.interface";
import QUERY_KEYS from "../../query-keys";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";

interface UseConnectionsProps {
  searchOptions: any;
}

interface UseConnections {
  connections: Connection[];
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
  totalCount: number;
}

export const useConnections = ({
  searchOptions,
}: UseConnectionsProps): UseConnections => {
  const { connectionService: service } = useApplicationServices();

  const query = useQuery<any>({
    queryKey: QUERY_KEYS.CONNECTION_LIST_KEY(searchOptions),
    queryFn: async () => {
      return await service.list(searchOptions);
    },
  });

  const { isLoading, isFetching, refetch, error, data } = query;

  const connections =
    data?.items ?? [];
  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    // if (!isFetching) {
    await refetch();
    // }
  }, [isFetching]);

  return { connections, isInProgress, load, error, totalCount: data?.totalCount };
};
