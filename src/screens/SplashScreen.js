<<<<<<< HEAD
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={st.container}>
      <Animated.View style={[st.logoBox, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={st.logoIcon}><Text style={st.logoIconText}>N</Text></View>
        <Text style={st.logoText}>nestup</Text>
        <Text style={st.tagline}>Property • Rentals • Services</Text>
      </Animated.View>
      <Text style={st.footer}>Uttarakhand's #1 Local Marketplace</Text>
=======
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
>>>>>>> 902490acad43c647976c8c03bf85fbabf67f5c23
    </View>
  );
}

<<<<<<< HEAD
const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' },
  logoBox: { alignItems: 'center' },
  logoIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 16, elevation: 8 },
  logoIconText: { fontSize: 42, fontWeight: '900', color: '#01696f' },
  logoText: { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 8, letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 40, fontSize: 12, color: 'rgba(255,255,255,0.6)' },
});
=======
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
>>>>>>> 902490acad43c647976c8c03bf85fbabf67f5c23
