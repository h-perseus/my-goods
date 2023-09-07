
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Product } from '../product.interface';
import QUERY_KEYS from '../../query-keys';
import { useApplicationServices } from '../../../components/providers/application-services-provider.component';

interface UseProductProps {
  id: string;
}

interface UseProduct {
  product: Product | undefined;
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useProduct = ({
  id
}: UseProductProps): UseProduct => {

  const { productService: service} = useApplicationServices()

  const query = useQuery<Product>({
    queryKey: QUERY_KEYS.PRODUCT_KEY(id),
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

  return { product: data, isInProgress, load, error };
};
