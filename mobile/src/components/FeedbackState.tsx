import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface FeedbackStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  role?: 'alert' | 'none';
}

export function FeedbackState({
  title,
  description,
  icon,
  action,
  role = 'none',
}: FeedbackStateProps) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <View style={styles.message} accessible accessibilityRole={role}>
        {icon}
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
  },
  message: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
  },
});
