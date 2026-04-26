// Enhanced only the _styles_ to use new design tokens and fonts
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

export const ChipSelect = ({ options = [], value, onChange }) => {
  return (
    <ScrollView
      horizontal
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {options.map((option, index) => {
        const isActive = option === value;

        return (
          <TouchableOpacity
            key={`${option}-${index}`}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              isActive ? styles.activeChip : styles.inactiveChip,
              index !== options.length - 1 && styles.chipSpacing,
            ]}
          >
            <Text style={[styles.chipText, isActive ? styles.activeChipText : styles.inactiveChipText]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
  },
  chip: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderWidth: 1,
    marginBottom: SPACING.xs,
  },
  chipSpacing: { marginRight: SPACING.sm },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  inactiveChip: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
  },
  chipText: {
    fontFamily: FONTS.body,
    fontWeight: '600',
    fontSize: 15,
  },
  activeChipText: {
    color: "#fff",
  },
  inactiveChipText: {
    color: COLORS.text,
  },
});
