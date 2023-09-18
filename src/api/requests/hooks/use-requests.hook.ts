import { useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import QUERY_KEYS from "../../query-keys";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";
import { Request } from "../request.interface";

interface UseRequestsProps {
  searchOptions: any;
}

interface UseRequests {
  requests: Request[];
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useRequests = ({
  searchOptions,
}: UseRequestsProps): UseRequests => {
  const { requestService: service } = useApplicationServices();

  const query = useInfiniteQuery<Request[]>({
    queryKey: QUERY_KEYS.REQUEST_LIST_KEY(searchOptions),
    queryFn: async () => {
      return await service.list(searchOptions);
    },
  });

  const { isLoading, isFetching, refetch, error, data } = query;

  const requests =
    data?.pages?.flatMap((response: Request[]) => response) ?? [];
  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { requests, isInProgress, load, error };
};
