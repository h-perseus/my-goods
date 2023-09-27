import { useCallback } from "react";
import { useQuery } from "react-query";
import QUERY_KEYS from "../../query-keys";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";
import { isEmpty } from "../../../helpers/utils";
import { LOCAL_STORAGE_KEYS } from "../../../helpers/local-storage-keys";

interface UseAdmin {
  admin: any | undefined;
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useAdmin = (): UseAdmin => {
  const { userService: service } = useApplicationServices();

  const query = useQuery<any>({
    queryKey: QUERY_KEYS.ADMIN_KEY(
      localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED),
    ),
    queryFn: async () => {
      if (isEmpty(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED)))
        return undefined;
      return await service.getAdmin(
        localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED),
      );
    },
  });

  const { isLoading, isFetching, refetch, error, data } = query;

  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { admin: data, isInProgress, load, error };
};
