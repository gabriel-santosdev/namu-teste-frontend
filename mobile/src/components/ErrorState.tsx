import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { FeedbackState } from './FeedbackState';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  message,
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <FeedbackState
      role="alert"
      title="Não foi possível carregar"
      description={message}
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ busy: isRetrying, disabled: isRetrying }}
          disabled={isRetrying}
          onPress={onRetry}
          style={({ pressed }) => [
            styles.button,
            (pressed || isRetrying) && styles.buttonPressed,
          ]}
        >
          {isRetrying ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : null}
          <Text style={styles.buttonLabel}>Tentar novamente</Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});
