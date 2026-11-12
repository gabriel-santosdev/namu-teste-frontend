import type { ContentDetail } from '@namu/shared';
import { StyleSheet, Text, View } from 'react-native';
import { ContentThumbnail } from '../../../components/ContentThumbnail';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { useCategoryName } from '../../contents/hooks/useCategoryName';
import { ContentMetadata } from './ContentMetadata';
import { FavoriteButton } from './FavoriteButton';

interface ContentDetailViewProps {
  content: ContentDetail;
}

export function ContentDetailView({ content }: ContentDetailViewProps) {
  const getCategoryName = useCategoryName();

  return (
    <View style={styles.container}>
      <ContentThumbnail uri={content.thumbnailUrl} style={styles.thumbnail} />
      <View style={styles.header}>
        <Text style={styles.category}>{getCategoryName(content.category)}</Text>
        <Text style={styles.title} accessibilityRole="header">
          {content.title}
        </Text>
      </View>
      <FavoriteButton contentId={content.id} isFavorite={content.isFavorite} />
      <ContentMetadata content={content} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Sobre este conteúdo
        </Text>
        <Text style={styles.description}>{content.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  thumbnail: {
    borderRadius: 16,
  },
  header: {
    gap: spacing.sm,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    color: colors.text,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
  },
});
