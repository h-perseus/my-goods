import { useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import { Product } from "../product.interface";
import QUERY_KEYS from "../../query-keys";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";

interface UseProductsProps {
  searchOptions: any;
}

interface UseProducts {
  products: Product[];
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useProducts = ({
  searchOptions,
}: UseProductsProps): UseProducts => {
  const { productService: service } = useApplicationServices();

  const query = useInfiniteQuery<Product[]>({
    queryKey: QUERY_KEYS.PRODUCT_LIST_KEY(searchOptions),
    queryFn: async () => {
      return await service.list(searchOptions);
    },
  });

  const { isLoading, isFetching, refetch, error, data } = query;

  const products =
    data?.pages?.flatMap((response: Product[]) => response) ?? [];
  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { products, isInProgress, load, error };
};
