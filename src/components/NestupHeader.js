import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import NestupLogo from './NestupLogo';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
// Use Ionicons for notifications as a placeholder
import { Ionicons } from '@expo/vector-icons';

export default function NestupHeader({ user, onNotifPress }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoWrap}>
        <NestupLogo size={36} variant="light" />
        <Text style={styles.wordmark}>Nestup</Text>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={onNotifPress}>
          <Ionicons name="notifications-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        {user?.avatar && (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmark: {
    color: COLORS.primary,
    fontSize: 26,
    fontFamily: FONTS.heading,
    fontWeight: '800',
    marginLeft: 14,
    letterSpacing: 1.2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.lg,
    marginLeft: 12,
    backgroundColor: COLORS.border,
  },
});
