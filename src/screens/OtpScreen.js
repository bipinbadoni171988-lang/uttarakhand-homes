import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth'; // React Native Firebase
import NestupLogo from '../components/NestupLogo';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

export default function OtpScreen({ route, navigation }) {
  const { confirmation, phone } = route.params;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [resendLoading, setResendLoading] = useState(false);
  const inputs = useRef([]);

  // --- Auto listen for auth completion (Android instant verify, etc) ---
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // User already signed in by auto-verification, go directly forward
        navigation.replace('Home');
      }
    });
    return unsubscribe;
  }, [navigation]);

  // --- Auto focus timer for resend OTP ---
  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setTimeout(() => setResendTimer(v => Math.max(v - 1, 0)), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // --- Helper to join and submit the OTP ---
  const attemptVerify = async code => {
    setVerifying(true);
    setError('');
    try {
      await confirmation.confirm(code);
      // Success: onAuthStateChanged will auto-navigate (above)
      // If you want to force navigation now as fallback:
      navigation.replace('Home');
    } catch (e) {
      setError(
        e.code === 'auth/invalid-verification-code'
          ? 'Invalid code. Please check your SMS.'
          : e.code === 'auth/code-expired'
            ? 'Code expired. Please resend OTP.'
            : 'Verification failed. Try again.'
      );
      setVerifying(false);
    }
  };

  // --- Auto-submit when all boxes filled ---
  useEffect(() => {
    if (otp.join('').length === OTP_LENGTH && !verifying) {
      attemptVerify(otp.join(''));
    }
  // eslint-disable-next-line
  }, [otp]);

  // --- Handle input change for OTP boxes ---
  const handleChange = (text, idx) => {
    setError('');
    if (!/^\d*$/.test(text)) return; // Only allow numbers
    const chars = text.split('');
    let newOtp = [...otp];
    // Handle paste
    if (chars.length === OTP_LENGTH) {
      newOtp = chars.slice(0, OTP_LENGTH);
      setOtp(newOtp);
      if (inputs.current[OTP_LENGTH - 1]) inputs.current[OTP_LENGTH - 1].focus();
      return;
    }
    if (chars.length === 1) {
      newOtp[idx] = chars[0];
      setOtp(newOtp);
      if (idx < OTP_LENGTH - 1 && chars[0]) {
        inputs.current[idx + 1].focus();
        setActiveIdx(idx + 1);
      }
    } else if (chars.length === 0) {
      newOtp[idx] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && otp[idx] === '' && idx > 0) {
      // Move to previous box
      inputs.current[idx - 1].focus();
      let newOtp = [...otp];
      newOtp[idx - 1] = '';
      setOtp(newOtp);
      setActiveIdx(idx - 1);
    }
  };

  // --- Handle resend logic ---
  const handleResend = async () => {
    if (resendLoading || resendTimer > 0) return;
    setError('');
    setResendLoading(true);
    try {
      const newConfirmation = await auth().signInWithPhoneNumber(phone);
      // Manually replace current confirmation in the stack
      route.params.confirmation = newConfirmation;
      setOtp(Array(OTP_LENGTH).fill(''));
      setActiveIdx(0);
      setResendTimer(RESEND_COOLDOWN);
      inputs.current[0].focus();
    } catch (e) {
      setError(
        e.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : 'Failed to resend OTP. Try again in a bit.'
      );
    }
    setResendLoading(false);
  };

  return (
    <View style={styles.root}>
      <View style={{ alignItems: 'center', marginTop: 48, marginBottom: 16 }}>
        <NestupLogo size={50} variant="light" />
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>Sent to {phone}</Text>
      </View>

      <View style={styles.otpRow}>
        {Array(OTP_LENGTH).fill(0).map((_, idx) => (
          <TextInput
            key={idx}
            ref={el => (inputs.current[idx] = el)}
            style={[
              styles.otpBox,
              !!otp[idx] && styles.otpBoxFilled,
              error ? styles.otpBoxError : {},
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[idx]}
            onChangeText={txt => handleChange(txt, idx)}
            onFocus={() => setActiveIdx(idx)}
            onKeyPress={e => handleKeyPress(e, idx)}
            autoFocus={idx === 0}
            textContentType="oneTimeCode"
            selectionColor={COLORS.primary}
            returnKeyType="next"
            accessible
            accessibilityLabel={`OTP digit ${idx + 1}`}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
      {verifying && (
        <View style={styles.spinnerRow}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={handleResend}
          disabled={resendLoading || resendTimer > 0}
        >
          <Text
            style={[
              styles.resendTxt,
              resendTimer > 0 || resendLoading ? styles.resendDisabled : {},
            ]}
          >
            {resendLoading
              ? 'Resending...'
              : resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : 'Resend OTP'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.changePhoneBtn}
        >
          <Text style={styles.changePhoneTxt}>Change phone number</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 15,
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    marginTop: 5,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    gap: 10,
  },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: RADIUS.sm,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 28,
    fontFamily: FONTS.heading,
    color: COLORS.text,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginHorizontal: 4,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#f3fdf8',
  },
  otpBoxError: {
    borderColor: '#d33',
  },
  errorTxt: {
    color: '#d33',
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontSize: 15,
    marginBottom: 4,
    minHeight: 16,
  },
  spinnerRow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  actionRow: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendTxt: {
    color: COLORS.accent,
    fontFamily: FONTS.body,
    fontWeight: '700',
    fontSize: 15,
  },
  resendDisabled: {
    opacity: 0.5,
  },
  changePhoneBtn: {
    marginTop: 16,
  },
  changePhoneTxt: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});
