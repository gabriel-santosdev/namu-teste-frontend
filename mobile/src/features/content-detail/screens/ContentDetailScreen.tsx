import { getErrorMessage, isClientError } from '@namu/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from '../../../components/ErrorState';
import { FeedbackState } from '../../../components/FeedbackState';
import { LoadingState } from '../../../components/LoadingState';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { ContentDetailView } from '../components/ContentDetailView';
import { useContent } from '../hooks/useContent';

type ContentDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ContentDetail'
>;

export function ContentDetailScreen({
  route,
  navigation,
}: ContentDetailScreenProps) {
  const { data, error, isPending, isRefetching, refetch } = useContent(
    route.params.id,
  );
  const { isRefreshing, onRefresh } = usePullToRefresh(refetch);
  const insets = useSafeAreaInsets();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleBackToList = useCallback(() => {
    navigation.popTo('Contents');
  }, [navigation]);

  if (isPending) {
    return <LoadingState title="Carregando conteúdo…" />;
  }

  if (!data) {
    if (isClientError(error)) {
      return (
        <FeedbackState
          title="Conteúdo não encontrado"
          description="O conteúdo que você procura não existe ou foi removido."
          action={
            <Pressable
              accessibilityRole="button"
              onPress={handleBackToList}
              style={({ pressed }) => [
                styles.outlinedButton,
                pressed && styles.outlinedButtonPressed,
              ]}
            >
              <Text style={styles.outlinedButtonLabel}>
                Ver todos os conteúdos
              </Text>
            </Pressable>
          }
        />
      );
    }

    return (
      <ErrorState
        message={getErrorMessage(error)}
        onRetry={handleRetry}
        isRetrying={isRefetching}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: spacing.xl * 2 + insets.bottom },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <ContentDetailView content={data} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
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
