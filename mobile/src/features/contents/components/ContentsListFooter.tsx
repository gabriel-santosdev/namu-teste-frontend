import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

interface ContentsListFooterProps {
  isLoadingMore: boolean;
  loadMoreError: string | null;
  hasReachedEnd: boolean;
  onRetry: () => void;
}

export function ContentsListFooter({
  isLoadingMore,
  loadMoreError,
  hasReachedEnd,
  onRetry,
}: ContentsListFooterProps) {
  if (isLoadingMore) {
    return (
      <View style={styles.container} accessibilityLiveRegion="polite">
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.message}>Carregando mais conteúdos…</Text>
      </View>
    );
  }

  if (loadMoreError) {
    return (
      <View style={styles.container}>
        <Text
          style={styles.error}
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          {loadMoreError}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
        >
          <Text style={styles.retryLabel}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (hasReachedEnd) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Você chegou ao fim da lista</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  retryButtonPressed: {
    backgroundColor: colors.primarySoft,
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
