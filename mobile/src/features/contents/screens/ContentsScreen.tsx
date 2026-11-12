import { getErrorMessage, type Content } from '@namu/shared';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '../../../components/ErrorState';
import { FeedbackState } from '../../../components/FeedbackState';
import { LoadingState } from '../../../components/LoadingState';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { ContentListItem } from '../components/ContentListItem';
import { useCategoryName } from '../hooks/useCategoryName';
import { useFirstContentsPage } from '../hooks/useFirstContentsPage';

function keyExtractor(content: Content) {
  return String(content.id);
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

export function ContentsScreen() {
  const { data, error, isPending, isRefetching, refetch } =
    useFirstContentsPage();
  const getCategoryName = useCategoryName();
  const [isPullRefreshing, setPullRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setPullRefreshing(false);
    }
  }, [refetch]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: Content }) => (
      <ContentListItem
        content={item}
        categoryName={getCategoryName(item.category)}
      />
    ),
    [getCategoryName],
  );

  if (isPending) {
    return <LoadingState title="Carregando conteúdos…" />;
  }

  if (!data) {
    return (
      <ErrorState
        message={getErrorMessage(error)}
        onRetry={handleRetry}
        isRetrying={isRefetching}
      />
    );
  }

  return (
    <FlatList
      data={data.data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        data.data.length > 0 ? (
          <Text style={styles.summary}>
            {data.data.length} de {data.total} conteúdos
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <FeedbackState
          title="Nenhum conteúdo por aqui"
          description="Ainda não há conteúdos disponíveis. Puxe para atualizar."
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={isPullRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
  summary: {
    marginBottom: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
