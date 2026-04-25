import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export const FormField = ({
  label,
  value,
  onChangeText,
  keyboard = 'default',
  secure = false,
  placeholder = '',
  multiline = false,
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboard}
        secureTextEntry={secure}
        placeholder={placeholder}
        multiline={multiline}
        style={[styles.input, { minHeight: multiline ? 96 : 50 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#555',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
});
