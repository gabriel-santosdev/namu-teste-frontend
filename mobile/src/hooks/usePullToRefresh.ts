import { useCallback, useState } from 'react';

export function usePullToRefresh(refetch: () => Promise<unknown>) {
  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return { isRefreshing, onRefresh };
}
