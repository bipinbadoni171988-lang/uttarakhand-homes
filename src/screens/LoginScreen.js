import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.replace(/\s/g, '').length < 10) { Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.navigate('OTP', { phone: '+91' + phone }); }, 1200);
  };

  return (
    <SafeAreaView style={st.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={st.container}>
          <View style={st.logoRow}>
            <View style={st.logoIcon}><Text style={st.logoIconTxt}>N</Text></View>
            <Text style={st.logoText}>nestup</Text>
          </View>
          <Text style={st.title}>Welcome Back</Text>
          <Text style={st.sub}>Enter your mobile number to continue</Text>
          <View style={st.inputWrap}>
            <View style={st.prefix}><Text style={st.prefixTxt}>🇮🇳 +91</Text></View>
            <TextInput style={st.input} placeholder="Mobile Number" placeholderTextColor="#bab9b4" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
          </View>
          <TouchableOpacity style={[st.btn, loading && { opacity: 0.7 }]} onPress={handleSendOTP} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={st.btnTxt}>Send OTP</Text>}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ fontSize: 14, color: '#7a7974' }}>New to Nestup? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={{ fontSize: 14, color: '#01696f', fontWeight: '700' }}>Create Account</Text></TouchableOpacity>
          </View>
          <View style={st.roleBox}>
            <Text style={{ fontSize: 13, color: '#7a7974', marginBottom: 8 }}>Are you a seller or service provider?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register', { role: 'seller' })}><Text style={{ fontSize: 14, color: '#964219', fontWeight: '700' }}>Register as Seller / Provider →</Text></TouchableOpacity>
          </View>
          <Text style={st.terms}>By continuing, you agree to Nestup's <Text style={{ color: '#01696f' }}>Terms</Text> and <Text style={{ color: '#01696f' }}>Privacy Policy</Text></Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f6f2' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 48 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 },
  logoIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' },
  logoIconTxt: { fontSize: 22, fontWeight: '900', color: '#fff' },
  logoText: { fontSize: 28, fontWeight: '800', color: '#01696f', letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: '700', color: '#28251d', marginBottom: 8 },
  sub: { fontSize: 14, color: '#7a7974', marginBottom: 32 },
  inputWrap: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#dcd9d5', marginBottom: 16, overflow: 'hidden' },
  prefix: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#f3f0ec', borderRightWidth: 1, borderRightColor: '#dcd9d5', justifyContent: 'center' },
  prefixTxt: { fontSize: 15, color: '#28251d', fontWeight: '600' },
  input: { flex: 1, paddingHorizontal: 16, fontSize: 16, color: '#28251d' },
  btn: { backgroundColor: '#01696f', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, elevation: 3 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  roleBox: { marginTop: 24, padding: 16, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#dcd9d5', alignItems: 'center' },
  terms: { fontSize: 11, color: '#bab9b4', textAlign: 'center', marginTop: 32, lineHeight: 18 },
});