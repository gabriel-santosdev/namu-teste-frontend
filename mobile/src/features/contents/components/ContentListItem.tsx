import { formatDuration, type Content } from '@namu/shared';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ContentThumbnail } from '../../../components/ContentThumbnail';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

interface ContentListItemProps {
  content: Content;
  categoryName: string;
  onPress: (contentId: number) => void;
}

export const ContentListItem = memo(function ContentListItem({
  content,
  categoryName,
  onPress,
}: ContentListItemProps) {
  const duration = formatDuration(content.durationSeconds);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(content.id)}
      android_ripple={{ color: colors.primarySoft, foreground: true }}
      accessibilityRole="button"
      accessibilityLabel={`${content.title}. Categoria: ${categoryName}. Duração: ${duration}`}
      accessibilityHint="Abre os detalhes do conteúdo"
    >
      <ContentThumbnail uri={content.thumbnailUrl} />
      <View style={styles.body}>
        <Text style={styles.category}>{categoryName}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {content.title}
        </Text>
        <View style={styles.footer}>
          <View style={styles.durationBadge}>
            <Text style={styles.durationLabel}>{duration}</Text>
          </View>
          <Text style={styles.detailsLink}>Ver detalhes ›</Text>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardPressed: {
    opacity: 0.85,
  },
  body: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  durationBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  durationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
