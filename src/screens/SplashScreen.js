import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NestupLogo from './NestupLogo';
import { COLORS, FONTS } from '../constants/theme';

export default function SplashScreen() {
  return (
    <View style={styles.root}>
      <NestupLogo size={88} variant="light" />
      <Text style={styles.wordmark}>Nestup</Text>
      <Text style={styles.subtag}>Find Your Space</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 36,
    color: '#fff',
    marginTop: 24,
    fontFamily: FONTS.heading,
    fontWeight: '700',
    letterSpacing: 1.0,
  },
  subtag: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONTS.body,
    marginTop: 8,
    fontWeight: '400',
    letterSpacing: 0.4,
  }
});
