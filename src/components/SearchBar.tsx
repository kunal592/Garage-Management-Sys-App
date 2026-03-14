import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { colors } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder || "Search customers..."}
        onChangeText={onChangeText}
        value={value}
        style={styles.searchBar}
        inputStyle={styles.input}
        placeholderTextColor={colors.textSecondary}
        iconColor={colors.primary}
        elevation={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    height: 52,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    minHeight: 0,
  },
});

export default SearchBar;
