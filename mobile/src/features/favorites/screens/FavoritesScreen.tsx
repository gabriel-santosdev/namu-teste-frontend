import { getErrorMessage, type Content } from '@namu/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  AccessibilityInfo,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from '../../../components/ErrorState';
import { FeedbackState } from '../../../components/FeedbackState';
import { LoadingState } from '../../../components/LoadingState';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { useCategoryName } from '../../contents/hooks/useCategoryName';
import { FavoriteListItem } from '../components/FavoriteListItem';
import { useFavorites } from '../hooks/useFavorites';
import { useRemoveFavorite } from '../hooks/useRemoveFavorite';

function keyExtractor(content: Content) {
  return String(content.id);
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function formatFavoritesCount(count: number): string {
  return count === 1
    ? '1 conteúdo favoritado'
    : `${count} conteúdos favoritados`;
}

type FavoritesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Favorites'
>;

export function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const { data, error, isPending, isRefetching, refetch } = useFavorites();
  const getCategoryName = useCategoryName();
  const { isRefreshing, onRefresh } = usePullToRefresh(refetch);
  const insets = useSafeAreaInsets();
  const [removeError, setRemoveError] = useState<string | null>(null);

  const { mutate: removeFavorite } = useRemoveFavorite({
    onError: removalError => {
      setRemoveError(
        `Não foi possível remover dos favoritos. ${getErrorMessage(
          removalError,
        )}`,
      );
    },
  });

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOpenContent = useCallback(
    (id: number) => {
      navigation.navigate('ContentDetail', { id });
    },
    [navigation],
  );

  const handleBrowseContents = useCallback(() => {
    navigation.popTo('Contents');
  }, [navigation]);

  const handleRemove = useCallback(
    (content: Content) => {
      setRemoveError(null);
      AccessibilityInfo.announceForAccessibility(
        `${content.title} removido dos favoritos`,
      );
      removeFavorite(content.id);
    },
    [removeFavorite],
  );

  const renderItem = useCallback(
    ({ item }: { item: Content }) => (
      <FavoriteListItem
        content={item}
        categoryName={getCategoryName(item.category)}
        onPress={handleOpenContent}
        onRemove={handleRemove}
      />
    ),
    [getCategoryName, handleOpenContent, handleRemove],
  );

  if (isPending) {
    return <LoadingState title="Carregando favoritos…" />;
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
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: spacing.lg + insets.bottom },
      ]}
      ListHeaderComponent={
        <View>
          {removeError ? (
            <Text
              style={styles.error}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
            >
              {removeError}
            </Text>
          ) : null}
          {data.length > 0 ? (
            <Text style={styles.summary}>
              {formatFavoritesCount(data.length)}
            </Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        <FeedbackState
          title="Nenhum favorito ainda"
          description="Toque em “Favoritar” nos detalhes de um conteúdo para encontrá-lo aqui."
          action={
            <Pressable
              accessibilityRole="button"
              onPress={handleBrowseContents}
              style={({ pressed }) => [
                styles.outlinedButton,
                pressed && styles.outlinedButtonPressed,
              ]}
            >
              <Text style={styles.outlinedButtonLabel}>Explorar conteúdos</Text>
            </Pressable>
          }
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
  error: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.error,
    backgroundColor: colors.errorSoft,
  },
  outlinedButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlinedButtonPressed: {
    backgroundColor: colors.primarySoft,
  },
  outlinedButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
