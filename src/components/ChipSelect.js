import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TEAL } from '../constants/theme';

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
    paddingVertical: 4,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  chipSpacing: {
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: TEAL,
  },
  inactiveChip: {
    backgroundColor: '#f4f6f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#fff',
  },
  inactiveChipText: {
    color: '#555',
  },
});
