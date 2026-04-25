import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TrendingCard({ title, subtitle, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = toValue => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 150,
    }).start();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onPress}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
      >
        <Text style={styles.title}>{title ?? 'Trending in your area'}</Text>
        <Text style={styles.subtitle}>{subtitle ?? 'Discover what others are checking out.'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Popular</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 13,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#ecf9f8',
    borderColor: '#b9e1df',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#01696f',
    fontSize: 12,
    fontWeight: '600',
  },
});
