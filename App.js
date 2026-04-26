import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  FlatList, TextInput, SafeAreaView, StatusBar, Modal,
  Animated, KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TAG_CLR = { VERIFIED: '#437a22', HOT: '#964219', NEW: '#006494', 'TOP RATED': '#01696f' };

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function SplashScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ scale }] }}>
        <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 16, elevation: 8 }}>
          <Text style={{ fontSize: 42, fontWeight: '900', color: '#01696f' }}>N</Text>
        </View>
        <Text style={{ fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: 2 }}>nestup</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 8, letterSpacing: 1 }}>Property • Rentals • Services</Text>
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 40, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Uttarakhand's #1 Local Marketplace</Text>
    </View>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const send = () => {
    if (phone.length < 10) { Alert.alert('Invalid Number', 'Enter a valid 10-digit number'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.navigate('OTP', { phone: '+91' + phone }); }, 1000);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f6f2' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 48 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>N</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#01696f', letterSpacing: 1 }}>nestup</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#28251d', marginBottom: 8 }}>Welcome Back</Text>
          <Text style={{ fontSize: 14, color: '#7a7974', marginBottom: 32 }}>Enter your mobile number to continue</Text>
          <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#dcd9d5', marginBottom: 16, overflow: 'hidden' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#f3f0ec', borderRightWidth: 1, borderRightColor: '#dcd9d5', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, color: '#28251d', fontWeight: '600' }}>+91</Text>
            </View>
            <TextInput style={{ flex: 1, paddingHorizontal: 16, fontSize: 16, color: '#28251d' }} placeholder="Mobile Number" placeholderTextColor="#bab9b4" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
          </View>
          <TouchableOpacity style={{ backgroundColor: '#01696f', borderRadius: 14, paddingVertical: 16, alignItems: 'center', elevation: 3, opacity: loading ? 0.7 : 1 }} onPress={send} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Send OTP</Text>}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ fontSize: 14, color: '#7a7974' }}>New to Nestup? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={{ fontSize: 14, color: '#01696f', fontWeight: '700' }}>Create Account</Text></TouchableOpacity>
          </View>
          <View style={{ marginTop: 24, padding: 16, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#dcd9d5', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: '#7a7974', marginBottom: 8 }}>Seller or Service Provider?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={{ fontSize: 14, color: '#964219', fontWeight: '700' }}>Register as Seller / Provider</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
const ROLES = [
  { key: 'buyer', label: 'Buyer / Renter', desc: 'Find property or services' },
  { key: 'seller', label: 'Seller', desc: 'List property for sale' },
  { key: 'rental', label: 'Rental Provider', desc: 'List cars, bikes or flats' },
  { key: 'service', label: 'Service Provider', desc: 'Offer plumbing, electrical etc.' },
];
function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const submit = () => {
    if (!name.trim()) { Alert.alert('Name required'); return; }
    if (phone.length < 10) { Alert.alert('Invalid number'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.navigate('OTP', { phone: '+91' + phone }); }, 1000);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f6f2' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
            <Text style={{ color: '#01696f', fontWeight: '600', fontSize: 16 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>N</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#01696f', letterSpacing: 1 }}>nestup</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#28251d', marginBottom: 6 }}>Create Account</Text>
          <Text style={{ fontSize: 14, color: '#7a7974', marginBottom: 24 }}>Join Uttarakhand's #1 local marketplace</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#28251d', marginBottom: 8 }}>Full Name</Text>
          <TextInput style={{ backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#dcd9d5', paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#28251d', marginBottom: 16 }} placeholder="Your full name" placeholderTextColor="#bab9b4" value={name} onChangeText={setName} autoCapitalize="words" />
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#28251d', marginBottom: 8 }}>Mobile Number</Text>
          <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#dcd9d5', marginBottom: 20, overflow: 'hidden' }}>
            <View style={{ paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#f3f0ec', borderRightWidth: 1, borderRightColor: '#dcd9d5', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, color: '#28251d', fontWeight: '600' }}>+91</Text>
            </View>
            <TextInput style={{ flex: 1, paddingHorizontal: 14, fontSize: 15, color: '#28251d' }} placeholder="10-digit mobile number" placeholderTextColor="#bab9b4" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
          </View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#28251d', marginBottom: 10 }}>I am a...</Text>
          {ROLES.map(r => (
            <TouchableOpacity key={r.key} onPress={() => setRole(r.key)} activeOpacity={0.8}
              style={{ backgroundColor: role === r.key ? '#f0f8f8' : '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: role === r.key ? '#01696f' : '#dcd9d5', padding: 14, marginBottom: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: role === r.key ? '#01696f' : '#28251d', marginBottom: 4 }}>{r.label}</Text>
              <Text style={{ fontSize: 12, color: role === r.key ? '#01696f' : '#7a7974' }}>{r.desc}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={{ backgroundColor: '#01696f', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, elevation: 3, opacity: loading ? 0.7 : 1 }} onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Create Account</Text>}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 14, color: '#7a7974' }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={{ fontSize: 14, color: '#01696f', fontWeight: '700' }}>Log In</Text></TouchableOpacity>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── OTP ──────────────────────────────────────────────────────────────────────
function OTPScreen({ navigation, route }) {
  const phone = (route.params && route.params.phone) ? route.params.phone : '+91XXXXXXXXXX';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);
  useEffect(() => {
    const iv = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(iv);
  }, []);
  const change = (text, i) => {
    const n = [...otp]; n[i] = text; setOtp(n);
    if (text && i < 5) inputs.current[i + 1] && inputs.current[i + 1].focus();
  };
  const bsp = (key, i) => { if (key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1] && inputs.current[i - 1].focus(); };
  const verify = () => {
    if (otp.join('').length < 6) { Alert.alert('Enter all 6 digits'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 1000);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f6f2' }}>
      <View style={{ flex: 1, padding: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 24 }}>
          <Text style={{ color: '#01696f', fontWeight: '600', fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>N</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#01696f' }}>nestup</Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '700', color: '#28251d', marginBottom: 8 }}>Verify OTP</Text>
        <Text style={{ fontSize: 14, color: '#7a7974', marginBottom: 32, lineHeight: 22 }}>We sent a 6-digit code to{'\n'}<Text style={{ color: '#28251d', fontWeight: '700' }}>{phone}</Text></Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
          {otp.map((d, i) => (
            <TextInput key={i} ref={r => { inputs.current[i] = r; }}
              style={{ width: 48, height: 56, borderRadius: 12, borderWidth: 1.5, borderColor: d ? '#01696f' : '#dcd9d5', backgroundColor: d ? '#f0f8f8' : '#fff', fontSize: 22, fontWeight: '700', color: '#28251d', textAlign: 'center' }}
              value={d} onChangeText={t => change(t, i)} onKeyPress={({ nativeEvent }) => bsp(nativeEvent.key, i)} keyboardType="number-pad" maxLength={1} selectTextOnFocus />
          ))}
        </View>
        <TouchableOpacity style={{ backgroundColor: '#01696f', borderRadius: 14, paddingVertical: 16, alignItems: 'center', elevation: 3, opacity: loading ? 0.7 : 1 }} onPress={verify} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Verify and Continue</Text>}
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          {timer > 0
            ? <Text style={{ fontSize: 14, color: '#7a7974' }}>Resend OTP in <Text style={{ color: '#01696f', fontWeight: '700' }}>{timer}s</Text></Text>
            : <TouchableOpacity onPress={() => setTimer(30)}><Text style={{ fontSize: 14, color: '#01696f', fontWeight: '700' }}>Resend OTP</Text></TouchableOpacity>}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
const CITIES = ['Dehradun', 'Haridwar', 'Rishikesh', 'Mussoorie', 'Nainital', 'Almora'];
const TP = [
  { id: '1', title: '3BHK House', price: '45L', loc: 'Rajpur Road', area: '1450 sqft', emoji: '🏠', color: '#01696f', tag: 'VERIFIED' },
  { id: '2', title: 'Commercial Shop', price: '85L', loc: 'Haridwar', area: '800 sqft', emoji: '🏪', color: '#01696f', tag: 'HOT' },
  { id: '3', title: 'Mountain Villa', price: '98L', loc: 'Mussoorie', area: '2200 sqft', emoji: '🏡', color: '#01696f', tag: 'NEW' },
];
const TR = [
  { id: '1', title: 'Swift Dzire', price: '1,200/day', loc: 'Dehradun', area: '5 Seats', emoji: '🚗', color: '#006494', tag: 'TOP RATED' },
  { id: '2', title: 'Royal Enfield', price: '800/day', loc: 'Rishikesh', area: '2 Seats', emoji: '🏍', color: '#006494', tag: 'HOT' },
  { id: '3', title: '1BHK Flat', price: '12K/mo', loc: 'Rajpur Road', area: 'Furnished', emoji: '🏠', color: '#006494', tag: 'VERIFIED' },
];
const TS = [
  { id: '1', title: 'Rajesh Plumber', price: '400/visit', loc: 'Dehradun', area: '4.8 stars', emoji: '🔧', color: '#964219', tag: 'VERIFIED' },
  { id: '2', title: 'Deepak Electric', price: '500/visit', loc: 'Haridwar', area: '4.9 stars', emoji: '⚡', color: '#964219', tag: 'TOP RATED' },
  { id: '3', title: 'Mohan Painter', price: '200/sqft', loc: 'Dehradun', area: '4.7 stars', emoji: '🖌', color: '#964219', tag: 'NEW' },
];

function TCard({ item }) {
  return (
    <View style={{ width: 175, marginRight: 14, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 3 }}>
      <View style={{ height: 90, backgroundColor: item.color, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: TAG_CLR[item.tag] || '#01696f', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 }}>
          <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{item.tag}</Text>
        </View>
        <Text style={{ fontSize: 34 }}>{item.emoji}</Text>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#28251d', marginBottom: 3 }} numberOfLines={1}>{item.title}</Text>
        <Text style={{ fontSize: 14, fontWeight: '800', color: item.color, marginBottom: 2 }}>Rs. {item.price}</Text>
        <Text style={{ fontSize: 11, color: '#7a7974' }} numberOfLines={1}>{item.area}</Text>
        <Text style={{ fontSize: 11, color: '#7a7974' }} numberOfLines={1}>{item.loc}</Text>
      </View>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [city, setCity] = useState('Dehradun');
  const [showCities, setShowCities] = useState(false);
  const banners = [
    { emoji: '🏠', title: 'Property for Sale', sub: 'Houses, Plots, Commercial', color: '#01696f', screen: 'Properties' },
    { emoji: '🚗', title: 'Rentals', sub: 'Cars, Bikes, Flats, Equipment', color: '#006494', screen: 'Rentals' },
    { emoji: '🔧', title: 'Services', sub: 'Plumbers, Electricians, Maids', color: '#964219', screen: 'Services' },
  ];
  const sections = [
    { title: 'Trending Properties', data: TP, screen: 'Properties' },
    { title: 'Trending Rentals', data: TR, screen: 'Rentals' },
    { title: 'Trending Services', data: TS, screen: 'Services' },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f6f2' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f6f2" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>N</Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#01696f', letterSpacing: 1 }}>nestup</Text>
          </View>
          <TouchableOpacity onPress={() => setShowCities(!showCities)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#dcd9d5' }}>
            <Text style={{ fontSize: 13, color: '#28251d', fontWeight: '600' }}>{city}</Text>
            <Text style={{ fontSize: 10, color: '#7a7974' }}>{showCities ? 'v' : '>'}</Text>
          </TouchableOpacity>
        </View>
        {showCities && (
          <View style={{ marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 14, padding: 8, elevation: 4, flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {CITIES.map(c => (
              <TouchableOpacity key={c} onPress={() => { setCity(c); setShowCities(false); }}
                style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: city === c ? '#01696f' : '#f3f0ec' }}>
                <Text style={{ fontSize: 13, color: city === c ? '#fff' : '#28251d', fontWeight: city === c ? '700' : '500' }}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 16, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#dcd9d5', paddingHorizontal: 14, gap: 8 }}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput style={{ flex: 1, paddingVertical: 13, fontSize: 14, color: '#28251d' }} placeholder="Search properties, rentals, services..." placeholderTextColor="#bab9b4" />
        </View>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#28251d', paddingHorizontal: 20, marginBottom: 14 }}>What are you looking for today?</Text>
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {banners.map(b => (
            <TouchableOpacity key={b.screen} onPress={() => navigation.navigate(b.screen)} activeOpacity={0.85}
              style={{ backgroundColor: b.color, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 4 }}>
              <Text style={{ fontSize: 30 }}>{b.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>{b.title}</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{b.sub}</Text>
              </View>
              <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#28251d' }}>Browse</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {sections.map(s => (
          <View key={s.screen} style={{ marginTop: 28, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#28251d' }}>🔥 {s.title}</Text>
              <TouchableOpacity onPress={() => navigation.navigate(s.screen)}>
                <Text style={{ fontSize: 13, color: '#01696f', fontWeight: '700' }}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList data={s.data} horizontal showsHorizontalScrollIndicator={false} keyExtractor={i => i.id} renderItem={({ item }) => <TCard item={item} />} />
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── PROPERTIES ───────────────────────────────────────────────────────────────
const PROP_TYPES = ['All', 'House', 'Apartment', 'Plot', 'Commercial', 'Villa'];
const PROPS = [
  { id: '1', title: '3BHK Independent House', price: '45L', loc: 'Rajpur Road, Dehradun', area: '1450 sqft', type: 'House', tag: 'VERIFIED', beds: 3, baths: 2 },
  { id: '2', title: 'Commercial Shop', price: '85L', loc: 'Haridwar Market', area: '800 sqft', type: 'Commercial', tag: 'HOT', beds: 0, baths: 1 },
  { id: '3', title: 'Mountain View Villa', price: '98L', loc: 'Mussoorie', area: '2200 sqft', type: 'Villa', tag: 'NEW', beds: 4, baths: 3 },
  { id: '4', title: '2BHK Apartment', price: '32L', loc: 'Clement Town', area: '980 sqft', type: 'Apartment', tag: 'VERIFIED', beds: 2, baths: 2 },
  { id: '5', title: 'Agricultural Plot', price: '18L', loc: 'Pauri Garhwal', area: '5000 sqft', type: 'Plot', tag: 'NEW', beds: 0, baths: 0 },
];
function PropertyScreen() {
  const [sel, setSel] = useState('All');
  const [modal, setModal] = useState(false);
  const data = sel === 'All' ? PROPS : PROPS.filter(p => p.type === sel);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f6f2' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#28251d' }}>Properties for Sale</Text>
        <TouchableOpacity onPress={() => setModal(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#dcd9d5' }}>
          <Text style={{ fontSize: 13, color: '#28251d', fontWeight: '600' }}>Filter</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
        {PROP_TYPES.map(t => (
          <TouchableOpacity key={t} onPress={() => setSel(t)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: sel === t ? '#01696f' : '#fff', borderWidth: 1, borderColor: sel === t ? '#01696f' : '#dcd9d5' }}>
            <Text style={{ fontSize: 13, color: sel === t ? '#fff' : '#28251d', fontWeight: sel === t ? '700' : '500' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={{ fontSize: 12, color: '#7a7974', paddingHorizontal: 20, marginBottom: 12 }}>{data.length} properties found</Text>
      <FlatList data={data} keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, marginBottom: 16, overflow: 'hidden', elevation: 3 }}>
            <View style={{ height: 110, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: TAG_CLR[item.tag] || '#01696f', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{item.tag}</Text>
              </View>
              <Text style={{ fontSize: 42 }}>🏠</Text>
            </View>
            <View style={{ padding: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#28251d', marginBottom: 6 }}>{item.title}</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#01696f', marginBottom: 4 }}>Rs. {item.price}</Text>
              <Text style={{ fontSize: 12, color: '#7a7974', marginBottom: 2 }}>{item.area}{item.beds > 0 ? '  -  ' + item.beds + ' Beds  -  ' + item.baths + ' Baths' : ''}</Text>
              <Text style={{ fontSize: 12, color: '#7a7974', marginBottom: 12 }}>{item.loc}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#01696f', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}><Text style={{ fontSize: 13, color: '#fff', fontWeight: '700' }}>Call</Text></TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#437a22', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}><Text style={{ fontSize: 13, color: '#fff', fontWeight: '700' }}>WhatsApp</Text></TouchableOpacity>
                <TouchableOpacity style={{ width: 42, backgroundColor: '#f3f0ec', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>♡</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={{ position: 'absolute', bottom: 24, right: 20, backgroundColor: '#01696f', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, elevation: 6 }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>+ Post Property</Text>
      </TouchableOpacity>
      <Modal visible={modal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#28251d' }}>Filters</Text>
              <TouchableOpacity onPress={() => setModal(false)}><Text style={{ fontSize: 20, color: '#7a7974' }}>X</Text></TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#28251d', marginBottom: 10 }}>Property Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {PROP_TYPES.map(t => (
                <TouchableOpacity key={t} onPress={() => setSel(t)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: sel === t ? '#01696f' : '#f3f0ec' }}>
                  <Text style={{ fontSize: 13, color: sel === t ? '#fff' : '#28251d', fontWeight: sel === t ? '700' : '500' }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#28251d', marginTop: 20, marginBottom: 10 }}>Location</Text>
            <TouchableOpacity style={{ backgroundColor: '#f0f8f8', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#01696f', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#01696f', fontWeight: '700' }}>Use My Current Location</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModal(false)} style={{ backgroundColor: '#01696f', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── RENTALS ──────────────────────────────────────────────────────────────────
const RENT_TYPES = ['All', 'Car', 'Bike', 'Flat', 'Shop', 'Equipment'];
const RENTS = [
  { id: '1', title: 'Swift Dzire (2023)', price: '1,200/day', loc: 'Dehradun', meta: '5 Seats - AC - Petrol', type: 'Car', tag: 'TOP RATED', emoji: '🚗' },
  { id: '2', title: 'Royal Enfield 350', price: '800/day', loc: 'Rishikesh', meta: '2 Seats - Petrol', type: 'Bike', tag: 'HOT', emoji: '🏍' },
  { id: '3', title: '1BHK Furnished Flat', price: '12,000/mo', loc: 'Rajpur Road', meta: '1 BHK - Furnished', type: 'Flat', tag: 'VERIFIED', emoji: '🏠' },
  { id: '4', title: 'Commercial Shop', price: '15,000/mo', loc: 'Haridwar', meta: '450 sqft - Ground Floor', type: 'Shop', tag: 'NEW', emoji: '🏪' },
  { id: '5', title: 'Tata Nexon', price: '2,000/day', loc: 'Nainital', meta: '5 Seats - SUV - Diesel', type: 'Car', tag: 'VERIFIED', emoji: '🚙' },
];
function RentalsScreen() {
  const [sel, setSel] = useState('All');
  const [modal, setModal] = useState(false);
  const data = sel === 'All' ? RENTS : RENTS.filter(r => r.type === sel);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f6f2' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#28251d' }}>Rentals</Text>
        <TouchableOpacity onPress={() => setModal(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#dcd9d5' }}>
          <Text style={{ fontSize: 13, color: '#28251d', fontWeight: '600' }}>Filter</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
        {RENT_TYPES.map(t => (
          <TouchableOpacity key={t} onPress={() => setSel(t)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: sel === t ? '#006494' : '#fff', borderWidth: 1, borderColor: sel === t ? '#006494' : '#dcd9d5' }}>
            <Text style={{ fontSize: 13, color: sel === t ? '#fff' : '#28251d', fontWeight: sel === t ? '700' : '500' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={{ fontSize: 12, color: '#7a7974', paddingHorizontal: 20, marginBottom: 12 }}>{data.length} rentals found</Text>
      <FlatList data={data} keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, marginBottom: 16, overflow: 'hidden', elevation: 3 }}>
            <View style={{ height: 110, backgroundColor: '#006494', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: TAG_CLR[item.tag] || '#006494', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{item.tag}</Text>
              </View>
              <Text style={{ fontSize: 42 }}>{item.emoji}</Text>
            </View>
            <View style={{ padding: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#28251d', marginBottom: 6 }}>{item.title}</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#006494', marginBottom: 4 }}>Rs. {item.price}</Text>
              <Text style={{ fontSize: 12, color: '#7a7974', marginBottom: 2 }}>{item.meta}</Text>
              <Text style={{ fontSize: 12, color: '#7a7974', marginBottom: 12 }}>{item.loc}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={{ flex: 1.5, backgroundColor: '#006494', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}><Text style={{ fontSize: 13, color: '#fff', fontWeight: '700' }}>Book Now</Text></TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#01696f', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}><Text style={{ fontSize: 13, color: '#fff', fontWeight: '700' }}>Call</Text></TouchableOpacity>
                <TouchableOpacity style={{ width: 42, backgroundColor: '#f3f0ec', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>♡</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={{ position: 'absolute', bottom: 24, right: 20, backgroundColor: '#006494', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, elevation: 6 }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>+ Post Rental</Text>
      </TouchableOpacity>
      <Modal visible={modal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#28251d' }}>Filters</Text>
              <TouchableOpacity onPress={() => setModal(false)}><Text style={{ fontSize: 20, color: '#7a7974' }}>X</Text></TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#28251d', marginBottom: 10 }}>Rental Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {RENT_TYPES.map(t => (
                <TouchableOpacity key={t} onPress={() => setSel(t)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: sel === t ? '#006494' : '#f3f0ec' }}>
                  <Text style={{ fontSize: 13, color: sel === t ? '#fff' : '#28251d', fontWeight: sel === t ? '700' : '500' }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={{ backgroundColor: '#f0f4f8', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#006494', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#006494', fontWeight: '700' }}>Use My Current Location</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModal(false)} style={{ backgroundColor: '#006494', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const SVC_TYPES = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Maid', 'Driver'];
const SVCS = [
  { id: '1', name: 'Rajesh Kumar', service: 'Plumber', price: '400/visit', loc: 'Dehradun', exp: '8 yrs', rating: '4.8', jobs: '120+', tag: 'VERIFIED', avail: true },
  { id: '2', name: 'Deepak Negi', service: 'Electrician', price: '500/visit', loc: 'Haridwar', exp: '12 yrs', rating: '4.9', jobs: '250+', tag: 'TOP RATED', avail: true },
  { id: '3', name: 'Mohan Rawat', service: 'Painter', price: '200/sqft', loc: 'Dehradun', exp: '5 yrs', rating: '4.7', jobs: '80+', tag: 'NEW', avail: false },
  { id: '4', name: 'Sunita Devi', service: 'Maid', price: '8,000/mo', loc: 'Dehradun', exp: '3 yrs', rating: '4.6', jobs: '40+', tag: 'VERIFIED', avail: true },
  { id: '5', name: 'Ramesh Bhatt', service: 'Carpenter', price: '600/visit', loc: 'Rishikesh', exp: '15 yrs', rating: '5.0', jobs: '300+', tag: 'TOP RATED', avail: true },
];
function ServicesScreen() {
  const [sel, setSel] = useState('All');
  const [modal, setModal] = useState(false);
  const data = sel === 'All' ? SVCS : SVCS.filter(s => s.service === sel);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f6f2' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#28251d' }}>Services</Text>
        <TouchableOpacity onPress={() => setModal(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#dcd9d5' }}>
          <Text style={{ fontSize: 13, color: '#28251d', fontWeight: '600' }}>Filter</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
        {SVC_TYPES.map(t => (
          <TouchableOpacity key={t} onPress={() => setSel(t)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: sel === t ? '#964219' : '#fff', borderWidth: 1, borderColor: sel === t ? '#964219' : '#dcd9d5' }}>
            <Text style={{ fontSize: 13, color: sel === t ? '#fff' : '#28251d', fontWeight: sel === t ? '700' : '500' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={{ fontSize: 12, color: '#7a7974', paddingHorizontal: 20, marginBottom: 12 }}>{data.length} providers found</Text>
      <FlatList data={data} keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, marginBottom: 16, padding: 16, elevation: 3 }}>
            <View style={{ flexDirection: 'row', gap: 14, marginBottom: 12 }}>
              <View style={{ position: 'relative' }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#964219', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: item.avail ? '#437a22' : '#bab9b4', borderWidth: 2, borderColor: '#fff' }} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#28251d' }}>{item.name}</Text>
                  <View style={{ backgroundColor: TAG_CLR[item.tag] || '#01696f', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 }}>
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: '#964219', fontWeight: '600', marginBottom: 2 }}>{item.service}</Text>
                <Text style={{ fontSize: 12, color: '#7a7974', marginBottom: 4 }}>{item.exp} exp - {item.jobs} jobs</Text>
                <Text style={{ fontSize: 12, color: '#28251d', fontWeight: '700' }}>★ {item.rating}  {item.avail ? 'Available' : 'Busy'}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f0ec', marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: '#7a7974' }}>{item.loc}</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#964219' }}>Rs. {item.price}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={{ flex: 1.5, backgroundColor: '#964219', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}><Text style={{ fontSize: 13, color: '#fff', fontWeight: '700' }}>Book Now</Text></TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#01696f', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}><Text style={{ fontSize: 13, color: '#fff', fontWeight: '700' }}>Call</Text></TouchableOpacity>
              <TouchableOpacity style={{ width: 42, backgroundColor: '#437a22', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>💬</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={{ position: 'absolute', bottom: 24, right: 20, backgroundColor: '#964219', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, elevation: 6 }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>+ Register as Provider</Text>
      </TouchableOpacity>
      <Modal visible={modal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#28251d' }}>Filters</Text>
              <TouchableOpacity onPress={() => setModal(false)}><Text style={{ fontSize: 20, color: '#7a7974' }}>X</Text></TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#28251d', marginBottom: 10 }}>Service Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {SVC_TYPES.map(t => (
                <TouchableOpacity key={t} onPress={() => setSel(t)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: sel === t ? '#964219' : '#f3f0ec' }}>
                  <Text style={{ fontSize: 13, color: sel === t ? '#fff' : '#28251d', fontWeight: sel === t ? '700' : '500' }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={{ backgroundColor: '#fdf5ef', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#964219', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#964219', fontWeight: '700' }}>Use My Current Location</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModal(false)} style={{ backgroundColor: '#964219', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
const MENU = [
  { icon: '🏠', label: 'My Listings', sub: 'Properties you have posted' },
  { icon: '❤', label: 'Saved Properties', sub: 'Your bookmarked listings' },
  { icon: '📋', label: 'My Bookings', sub: 'Rental and service bookings' },
  { icon: '✏', label: 'Edit Profile', sub: 'Update your information' },
  { icon: '🔔', label: 'Notifications', sub: 'Manage your alerts' },
  { icon: '🛡', label: 'Verification', sub: 'Verify your identity' },
  { icon: '📞', label: 'Help and Support', sub: 'Contact us or FAQ' },
  { icon: '📄', label: 'Terms and Privacy', sub: 'Legal information' },
  { icon: '🚪', label: 'Log Out', sub: 'Sign out of Nestup', danger: true },
];
function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f6f2' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>N</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#01696f', letterSpacing: 1 }}>nestup</Text>
        </View>
        <View style={{ marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, elevation: 3, marginBottom: 16 }}>
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#01696f', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff' }}>U</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#28251d', marginBottom: 2 }}>User Name</Text>
            <Text style={{ fontSize: 13, color: '#7a7974', marginBottom: 8 }}>+91 98XXX XXXXX</Text>
            <View style={{ backgroundColor: '#f0f8f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' }}>
              <Text style={{ fontSize: 12, color: '#01696f', fontWeight: '600' }}>Buyer</Text>
            </View>
          </View>
          <TouchableOpacity style={{ backgroundColor: '#f3f0ec', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 }}>
            <Text style={{ fontSize: 13, color: '#28251d', fontWeight: '600' }}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 18, paddingVertical: 16, flexDirection: 'row', elevation: 2, marginBottom: 20 }}>
          {[['0', 'Listings'], ['0', 'Saved'], ['0', 'Bookings']].map(([n, l], i) => (
            <React.Fragment key={l}>
              {i > 0 && <View style={{ width: 1, backgroundColor: '#dcd9d5' }} />}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#01696f' }}>{n}</Text>
                <Text style={{ fontSize: 12, color: '#7a7974', marginTop: 2 }}>{l}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
        <View style={{ marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', elevation: 2 }}>
          {MENU.map((item, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < MENU.length - 1 ? 1 : 0, borderBottomColor: '#f3f0ec', gap: 14 }} activeOpacity={0.7}>
              <Text style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: item.danger ? '#a12c7b' : '#28251d' }}>{item.label}</Text>
                <Text style={{ fontSize: 12, color: '#7a7974', marginTop: 1 }}>{item.sub}</Text>
              </View>
              {!item.danger && <Text style={{ fontSize: 20, color: '#bab9b4' }}>›</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ textAlign: 'center', fontSize: 11, color: '#bab9b4', marginTop: 24, marginBottom: 8 }}>Nestup v1.0.0 - Made for Uttarakhand</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── TAB NAVIGATOR ────────────────────────────────────────────────────────────
function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, fontWeight: '600', marginTop: 1, color: focused ? '#01696f' : '#bab9b4' }}>{label}</Text>
    </View>
  );
}
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f0ec', height: 68, paddingBottom: 8, paddingTop: 4, elevation: 12 }, tabBarShowLabel: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏡" label="Home" focused={focused} /> }} />
      <Tab.Screen name="Properties" component={PropertyScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Sale" focused={focused} /> }} />
      <Tab.Screen name="Rentals" component={RentalsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🚗" label="Rentals" focused={focused} /> }} />
      <Tab.Screen name="Services" component={ServicesScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔧" label="Services" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
