import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function InlineFilterIcon() {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.barRow, { width: 24 }]}>
        <View style={styles.handle} />
      </View>
      <View style={[styles.barRow, { width: 18, marginLeft: 3 }]}>
        <View style={[styles.handle, { left: 10 }]} />
      </View>
      <View style={[styles.barRow, { width: 12, marginLeft: 6 }]}>
        <View style={[styles.handle, { left: 4 }]} />
      </View>
    </View>
  );
}

export default function FilterBar({ onPress, label = 'Filters' }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <InlineFilterIcon />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#b9e1df',
    backgroundColor: '#ecf9f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    marginLeft: 8,
    color: '#01696f',
    fontWeight: '600',
    fontSize: 13,
  },
  iconWrap: {
    height: 16,
    justifyContent: 'space-between',
  },
  barRow: {
    height: 2,
    backgroundColor: '#01696f',
    borderRadius: 999,
    position: 'relative',
  },
  handle: {
    position: 'absolute',
    top: -3,
    left: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#01696f',
  },
});
