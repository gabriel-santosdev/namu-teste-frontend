import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export function FavoritesHeaderButton() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      onPress={() => navigation.navigate('Favorites')}
      hitSlop={spacing.sm}
      accessibilityRole="button"
      accessibilityLabel="Favoritos"
      accessibilityHint="Abre a lista de conteúdos favoritados"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text
        style={styles.icon}
        importantForAccessibility="no"
        accessibilityElementsHidden
      >
        ♥︎
      </Text>
      <Text style={styles.label}>Favoritos</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  icon: {
    fontSize: 18,
    color: colors.primary,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
