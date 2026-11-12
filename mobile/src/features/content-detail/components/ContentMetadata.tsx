import {
  formatContentType,
  formatDuration,
  formatPublishedAt,
  type ContentDetail,
} from '@namu/shared';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

interface MetadataItem {
  label: string;
  value: string;
}

interface ContentMetadataProps {
  content: ContentDetail;
}

function toMetadataItems(content: ContentDetail): MetadataItem[] {
  return [
    { label: 'Tipo', value: formatContentType(content.type) },
    { label: 'Duração', value: formatDuration(content.durationSeconds) },
    { label: 'Instrutor(a)', value: content.instructor },
    { label: 'Publicado em', value: formatPublishedAt(content.publishedAt) },
  ];
}

export function ContentMetadata({ content }: ContentMetadataProps) {
  return (
    <View style={styles.grid}>
      {toMetadataItems(content).map(({ label, value }) => (
        <View
          key={label}
          style={styles.item}
          accessible
          accessibilityLabel={`${label}: ${value}`}
        >
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  item: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
