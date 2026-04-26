import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

export default function OTPScreen({ navigation, route }) {
  const { phone } = route.params || { phone: '+91XXXXXXXXXX' };
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleBackspace = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.join('').length < 6) { Alert.alert('Enter OTP', 'Please enter all 6 digits.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 1200);
  };

  return (
    <SafeAreaView style={st.safe}>
      <View style={st.container}>
        <TouchableOpacity style={{ marginBottom: 24 }} onPress={() => navigation.goBack()}><Text style={{ fontSize: 16, color: '#01696f', fontWeight: '600' }}>← Back</Text></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <View style={st.logoIcon}><Text style={st.logoIconTxt}>N</Text></View>
          <Text style={st.logoText}>nestup</Text>
        </View>
        <Text style={st.title}>Verify OTP</Text>
        <Text style={st.sub}>We sent a 6-digit code to{'\n'}<Text style={{ color: '#28251d', fontWeight: '700' }}>{phone}</Text></Text>
        <View style={st.otpRow}>
          {otp.map((digit, i) => (
            <TextInput key={i} ref={ref => inputs.current[i] = ref} style={[st.otpBox, digit && st.otpBoxFilled]}
              value={digit} onChangeText={text => handleChange(text, i)}
              onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, i)}
              keyboardType="number-pad" maxLength={1} textAlign="center" selectTextOnFocus />
          ))}
        </View>
        <TouchableOpacity style={[st.btn, loading && { opacity: 0.7 }]} onPress={handleVerify} disabled={loading} activeOpacity={0.85}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={st.btnTxt}>Verify & Continue</Text>}
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          {timer > 0
            ? <Text style={{ fontSize: 14, color: '#7a7974' }}>Resend OTP in <Text style={{ color: '#01696f', fontWeight: '700' }}>{timer}s</Text></Text>
            : <TouchableOpacity onPress={() => setTimer(30)}><Text style={{ fontSize: 14, color: '#01696f', fontWeight: '700' }}>Resend OTP</Text></TouchableOpacity>
          }
        </View>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f6f2' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  logoIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' },
  logoIconTxt: { fontSize: 22, fontWeight: '900', color: '#fff' },
  logoText: { fontSize: 28, fontWeight: '800', color: '#01696f', letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: '700', color: '#28251d', marginBottom: 8 },
  sub: { fontSize: 14, color: '#7a7974', marginBottom: 32, lineHeight: 22 },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32, justifyContent: 'center' },
  otpBox: { width: 48, height: 56, borderRadius: 12, borderWidth: 1.5, borderColor: '#dcd9d5', backgroundColor: '#fff', fontSize: 22, fontWeight: '700', color: '#28251d' },
  otpBoxFilled: { borderColor: '#01696f', backgroundColor: '#f0f8f8' },
  btn: { backgroundColor: '#01696f', borderRadius: 14, paddingVertical: 16, alignItems: 'center', elevation: 3 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});