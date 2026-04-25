import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const pulseOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseOpacity]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.prompt, { opacity: pulseOpacity }]}>
        What do you want to search today?
      </Animated.Text>
      <Text style={styles.subtext}>Explore homes, rentals, and local services.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fbfb',
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  prompt: {
    fontSize: 22,
    lineHeight: 30,
    color: '#0f172a',
    fontWeight: '700',
  },
  subtext: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
  },
});
