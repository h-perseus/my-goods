
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Domain } from '../domain.interface';
import QUERY_KEYS from '../../query-keys';
import { useApplicationServices } from '../../../components/providers/application-services-provider.component';

interface UseDomainProps {
  id: string;
}

interface UseDomain {
  domain: Domain | undefined;
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useDomain = ({
  id
}: UseDomainProps): UseDomain => {

  const { domainService: service} = useApplicationServices()

  const query = useQuery<Domain>({
    queryKey: QUERY_KEYS.DOMAIN_KEY(id),
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

  return { domain: data, isInProgress, load, error };
};
