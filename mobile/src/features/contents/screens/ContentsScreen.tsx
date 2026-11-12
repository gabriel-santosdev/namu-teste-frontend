import { getErrorMessage, type Content } from '@namu/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from '../../../components/ErrorState';
import { FeedbackState } from '../../../components/FeedbackState';
import { LoadingState } from '../../../components/LoadingState';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { ContentListItem } from '../components/ContentListItem';
import { ContentsListFooter } from '../components/ContentsListFooter';
import { SearchField } from '../components/SearchField';
import { useCategoryName } from '../hooks/useCategoryName';
import { useInfiniteContents } from '../hooks/useInfiniteContents';

function keyExtractor(content: Content) {
  return String(content.id);
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

type ContentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Contents'
>;

export function ContentsScreen({ navigation }: ContentsScreenProps) {
  const [search, setSearch] = useState('');
  const {
    data,
    error,
    isPending,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isPlaceholderData,
  } = useInfiniteContents(search);
  const getCategoryName = useCategoryName();
  const { isRefreshing, onRefresh } = usePullToRefresh(refetch);
  const insets = useSafeAreaInsets();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isFetchNextPageError) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  const handleRetryLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handleOpenContent = useCallback(
    (id: number) => {
      navigation.navigate('ContentDetail', { id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Content }) => (
      <ContentListItem
        content={item}
        categoryName={getCategoryName(item.category)}
        onPress={handleOpenContent}
      />
    ),
    [getCategoryName, handleOpenContent],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchField onSearch={setSearch} isSearching={isPlaceholderData} />
      </View>
      {renderBody()}
    </View>
  );

  function renderBody() {
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
        data={data.items}
        style={isPlaceholderData && styles.listStale}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: spacing.lg + insets.bottom },
        ]}
        ListHeaderComponent={
          data.items.length > 0 ? (
            <Text style={styles.summary}>
              {data.items.length} de {data.total} conteúdos
            </Text>
          ) : undefined
        }
        ListFooterComponent={
          data.items.length > 0 ? (
            <ContentsListFooter
              isLoadingMore={isFetchingNextPage}
              loadMoreError={
                isFetchNextPageError
                  ? `Não foi possível carregar mais conteúdos. ${getErrorMessage(
                      error,
                    )}`
                  : null
              }
              hasReachedEnd={!hasNextPage}
              onRetry={handleRetryLoadMore}
            />
          ) : undefined
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          search ? (
            <FeedbackState
              title={`Nenhum resultado para “${search}”`}
              description="Tente buscar por outro título."
            />
          ) : (
            <FeedbackState
              title="Nenhum conteúdo por aqui"
              description="Ainda não há conteúdos disponíveis. Puxe para atualizar."
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  listStale: {
    opacity: 0.6,
  },
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
