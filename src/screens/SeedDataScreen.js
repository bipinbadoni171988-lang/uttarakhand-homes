import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SeedDataScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seed Data Screen</Text>
      <Text style={styles.subtitle}>Use this screen to trigger development seed actions.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
});
