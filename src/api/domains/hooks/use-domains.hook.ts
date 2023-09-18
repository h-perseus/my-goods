import { useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import { Domain } from "../domain.interface";
import QUERY_KEYS from "../../query-keys";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";

interface UseDomainsProps {
  searchOptions: any;
}

interface UseDomains {
  domains: Domain[];
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useDomains = ({ searchOptions }: UseDomainsProps): UseDomains => {
  const { domainService: service } = useApplicationServices();

  const query = useInfiniteQuery<Domain[]>({
    queryKey: QUERY_KEYS.DOMAIN_LIST_KEY(searchOptions),
    queryFn: async () => {
      return await service.list(searchOptions);
    },
  });

  const { isLoading, isFetching, refetch, error, data } = query;

  const domains = data?.pages?.flatMap((response: Domain[]) => response) ?? [];
  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { domains, isInProgress, load, error };
};
