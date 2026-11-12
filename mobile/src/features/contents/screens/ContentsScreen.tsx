import { getErrorMessage, type Content } from '@namu/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '../../../components/ErrorState';
import { FeedbackState } from '../../../components/FeedbackState';
import { LoadingState } from '../../../components/LoadingState';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import type { RootStackParamList } from '../../../navigation/types';
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

type ContentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Contents'
>;

export function ContentsScreen({ navigation }: ContentsScreenProps) {
  const { data, error, isPending, isRefetching, refetch } =
    useFirstContentsPage();
  const getCategoryName = useCategoryName();
  const { isRefreshing, onRefresh } = usePullToRefresh(refetch);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

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
        ) : undefined
      }
      ListEmptyComponent={
        <FeedbackState
          title="Nenhum conteúdo por aqui"
          description="Ainda não há conteúdos disponíveis. Puxe para atualizar."
        />
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
