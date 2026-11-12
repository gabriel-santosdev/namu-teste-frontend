import { getErrorMessage } from '@namu/shared';
import { useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { useToggleFavorite } from '../../favorites/hooks/useToggleFavorite';

const FILLED_HEART = '♥︎';
const OUTLINED_HEART = '♡︎';

interface FavoriteButtonProps {
  contentId: number;
  isFavorite: boolean;
}

function buildErrorMessage(shouldFavorite: boolean, error: unknown): string {
  const action = shouldFavorite
    ? 'Não foi possível favoritar'
    : 'Não foi possível remover dos favoritos';
  return `${action} ${getErrorMessage(error)}`;
}

export function FavoriteButton({ contentId, isFavorite }: FavoriteButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate } = useToggleFavorite(contentId);

  const handlePress = () => {
    const shouldFavorite = !isFavorite;
    setErrorMessage(null);
    AccessibilityInfo.announceForAccessibility(
      shouldFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
    );
    mutate(
      { shouldFavorite },
      {
        onError: error => {
          setErrorMessage(buildErrorMessage(shouldFavorite, error));
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Favoritar"
        accessibilityState={{ selected: isFavorite }}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          isFavorite ? styles.buttonActive : styles.buttonInactive,
          pressed && styles.buttonPressed,
        ]}
        testID="favorite-button"
      >
        <Text
          style={[styles.icon, isFavorite && styles.labelActive]}
          importantForAccessibility="no"
          accessibilityElementsHidden
        >
          {isFavorite ? FILLED_HEART : OUTLINED_HEART}
        </Text>
        <Text style={[styles.label, isFavorite && styles.labelActive]}>
          {isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
        </Text>
      </Pressable>
      {errorMessage ? (
        <Text
          style={styles.error}
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonInactive: {
    backgroundColor: colors.surface,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  icon: {
    fontSize: 20,
    color: colors.primary,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  labelActive: {
    color: colors.white,
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.error,
  },
});
