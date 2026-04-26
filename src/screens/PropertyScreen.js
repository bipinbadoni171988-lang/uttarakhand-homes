import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PropertyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Properties for Sale</Text>
      <Text style={styles.sub}>Listings coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f6f2' },
  title: { fontSize: 24, fontWeight: '700', color: '#01696f' },
  sub: { fontSize: 14, color: '#999', marginTop: 8 },
});