import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
// If using Expo, swap with: import { getAuth, signInWithPhoneNumber } from 'firebase/auth';
import NestupLogo from '../components/NestupLogo';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PhoneEntryScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formattedPhone = `+91${phone.replace(/\D/g, '')}`;
  const isValid = /^\d{10}$/.test(phone);

  const sendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      // Replace this with your firebase instance if using web: e.g., signInWithPhoneNumber(firebaseAuth, formattedPhone, ...)
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      navigation.navigate('OtpScreen', { confirmation, phone: formattedPhone });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // Firebase error messages (adjust for your SDK)
      if (err.code === 'auth/invalid-phone-number') {
        setError('Please enter a valid 10-digit mobile number.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Wait and try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Check your connection.');
      } else {
        setError('Unable to send OTP. Please try again.');
      }
    }
  };

  // Guest browsing: If your app supports guest mode, show this
  const showGuest = true; // Set this flag only if guest mode is present in your navigation

  return (
    <View style={styles.root}>
      <View style={{ alignItems: 'center', marginTop: 48, marginBottom: 32 }}>
        <NestupLogo size={64} variant="light" />
        <Text style={styles.title}>Welcome to Nestup</Text>
        <Text style={styles.subtitle}>Sign in with your mobile number</Text>
      </View>
      <View style={styles.inputWrap}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.phoneRow}>
          <View style={styles.countryCodeBox}>
            <Text style={styles.countryCode}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            value={phone}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="Enter 10-digit mobile"
            placeholderTextColor={COLORS.textMuted}
            onChangeText={(v) => {
              setPhone(v.replace(/\D/g, ''));
              setError('');
            }}
            editable={!loading}
            autoFocus
          />
        </View>
        {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
      </View>
      <TouchableOpacity
        style={[
          styles.cta,
          !isValid || loading ? styles.ctaDisabled : {},
        ]}
        onPress={sendOTP}
        disabled={!isValid || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.ctaTxt}>Send OTP</Text>
        )}
      </TouchableOpacity>

      {showGuest && (
        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => navigation.replace('Home')}
        >
          <Ionicons name="log-in-outline" size={18} color={COLORS.accent} />
          <Text style={styles.guestTxt}>Continue as guest</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: COLORS.primary,
    fontFamily: FONTS.heading,
    fontWeight: '800',
    marginTop: 12,
    letterSpacing: 1.0,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    marginTop: 4,
    marginBottom: 8,
  },
  inputWrap: {
    marginVertical: 24,
  },
  label: {
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 15,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  countryCodeBox: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCode: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.body,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 18,
    color: COLORS.text,
    fontFamily: FONTS.body,
    backgroundColor: '#fff',
  },
  errorTxt: {
    color: '#d33',
    marginTop: 6,
    marginLeft: 2,
    fontFamily: FONTS.body,
    fontSize: 14,
  },
  cta: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaTxt: {
    color: '#fff',
    fontFamily: FONTS.heading,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  guestBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    paddingVertical: 6,
  },
  guestTxt: {
    color: COLORS.accent,
    fontFamily: FONTS.body,
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 15,
  },
});
