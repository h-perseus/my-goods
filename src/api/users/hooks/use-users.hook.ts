import { useCallback } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { User } from "../user.interface";
import QUERY_KEYS from "../../query-keys";
import { useApplicationServices } from "../../../components/providers/application-services-provider.component";

interface UseUsersProps {
  searchOptions: any;
}

interface UseUsers {
  users: User[];
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
  totalCount: number;
}

export const useUsers = ({ searchOptions }: UseUsersProps): UseUsers => {
  const { userService: service } = useApplicationServices();

  const query = useQuery<any>({
    queryKey: QUERY_KEYS.USER_LIST_KEY(searchOptions),
    queryFn: async () => {
      return await service.list(searchOptions);
    },
  });

  const { isLoading, isFetching, refetch, error, data } = query;

  const users = data?.items ?? [];
  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { users, isInProgress, load, error, totalCount: data?.totalCount };
};
