import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NestupLogo from '../components/NestupLogo';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

export default function ProfileSetupScreen({ navigation }) {
  const user = auth().currentUser;
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    setError('');
    if (!name.trim() || name.trim().split(' ').length < 2) {
      setError('Please enter your full name.');
      return;
    }
    setSaving(true);
    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          name: name.trim(),
          phone: user.phoneNumber,
          createdAt: firestore.FieldValue.serverTimestamp(),
          bookmarks: [],
        });
      setSaving(false);
      navigation.replace('App'); // Enter main app (tab navigator)
    } catch (e) {
      setSaving(false);
      setError('Failed to save. Check your connection and try again.');
    }
  };

  return (
    <View style={styles.root}>
      <NestupLogo size={54} variant="light" />
      <Text style={styles.title}>Set up your profile</Text>
      <Text style={styles.subtitle}>Just your name to get started</Text>
      <TextInput
        style={styles.input}
        value={name}
        placeholder="Your full name"
        placeholderTextColor={COLORS.textMuted}
        onChangeText={setName}
        editable={!saving}
        autoFocus
      />
      {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.cta, (!name.trim() || saving) && styles.ctaDisabled]}
        onPress={handleContinue}
        disabled={!name.trim() || saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.ctaTxt}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 28,
    marginBottom: 6,
    letterSpacing: 0.7,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    marginBottom: 28,
    fontSize: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 13,
    paddingHorizontal: 18,
    fontSize: 17,
    fontFamily: FONTS.body,
    color: COLORS.text,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 1 },
    marginBottom: 8,
  },
  errorTxt: {
    color: '#d33',
    fontFamily: FONTS.body,
    marginBottom: 8,
    fontSize: 14,
    textAlign: 'center'
  },
  cta: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 32,
    marginTop: 12,
    marginBottom: 18,
    minWidth: 165,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaTxt: {
    color: '#fff',
    fontFamily: FONTS.heading,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
