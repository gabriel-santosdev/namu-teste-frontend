import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const SEARCH_DEBOUNCE_MS = 400;

interface SearchFieldProps {
  onSearch: (search: string) => void;
  isSearching?: boolean;
}

export function SearchField({
  onSearch,
  isSearching = false,
}: SearchFieldProps) {
  const [inputValue, setInputValue] = useState('');
  const { debounced: debouncedSearch, cancel } = useDebouncedCallback(
    onSearch,
    SEARCH_DEBOUNCE_MS,
  );

  const handleChangeText = (text: string) => {
    setInputValue(text);
    debouncedSearch(text.trim());
  };

  const handleSubmit = () => {
    cancel();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    cancel();
    setInputValue('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={inputValue}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        placeholder="Buscar por título…"
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel="Buscar por título"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        style={styles.input}
      />
      {isSearching ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          accessibilityLabel="Buscando"
        />
      ) : null}
      {inputValue ? (
        <Pressable
          onPress={handleClear}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
        >
          <Text
            style={styles.clearIcon}
            importantForAccessibility="no"
            accessibilityElementsHidden
          >
            ✕
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  clearButtonPressed: {
    backgroundColor: colors.primarySoft,
  },
  clearIcon: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
