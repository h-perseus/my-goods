
import { useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { User } from '../user.interface';
import QUERY_KEYS from '../../query-keys';
import { useApplicationServices } from '../../../components/providers/application-services-provider.component';

interface UseUsersProps {
  searchOptions: any;
}

interface UseUsers {
  users: User[];
  isInProgress: boolean;
  load: () => Promise<void>;
  error: unknown;
}

export const useUsers = ({
  searchOptions
}: UseUsersProps): UseUsers => {

  const { userService: service} = useApplicationServices()

  const query = useInfiniteQuery<User[]>({
    queryKey: QUERY_KEYS.USER_LIST_KEY(searchOptions),
    queryFn: async () => {
      return await service.list(searchOptions);
    },
  });
  
  const { isLoading, isFetching, refetch, error, data } = query;

  const users =
  data?.pages?.flatMap((response: User[]) => response) ?? [];
  const isInProgress = isLoading || isFetching;

  const load = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  return { users, isInProgress, load, error };
};
