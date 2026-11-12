import { useState } from 'react';
import { Image, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ContentThumbnailProps {
  uri: string | null;
  style?: ViewStyle;
}

function Thumbnail({ uri, style }: ContentThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return (
      <View
        style={[styles.frame, styles.placeholder, style]}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
        testID="thumbnail-placeholder"
      >
        <Text style={styles.placeholderLabel}>Imagem não disponível</Text>
      </View>
    );
  }

  return (
    <View style={[styles.frame, style]}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        onError={() => setHasError(true)}
      />
    </View>
  );
}

export function ContentThumbnail(props: ContentThumbnailProps) {
  return <Thumbnail key={props.uri ?? 'placeholder'} {...props} />;
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  placeholderLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
