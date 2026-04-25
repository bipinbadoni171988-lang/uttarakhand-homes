// ─── ALL IMPORTS AT THE TOP ───────────────────────────────────
import { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TextInput,
  TouchableOpacity, FlatList, Linking, StatusBar,
  Image, Dimensions, Share,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  collection, onSnapshot, doc,
  setDoc, getDoc, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// ─── TAB NAVIGATOR (module level — never inside a component) ──
const Tab = createBottomTabNavigator();

// ─── CONSTANTS ────────────────────────────────────────────────
const SW         = Dimensions.get('window').width;
const SB_HEIGHT  = StatusBar.currentHeight || 44;
const TEAL       = '#01696f';
const TEAL_DARK  = '#014d52';
const TEAL_LIGHT = '#e8f5f5';
const GOLD       = '#f0a500';
const BG         = '#f0f4f7';

// ─── DATA ─────────────────────────────────────────────────────
const REGIONS = [
  { label: 'All',       icon: '🗺' },
  { label: 'Dehradun',  icon: '🏙' },
  { label: 'Mussoorie', icon: '🏔' },
  { label: 'Nainital',  icon: '🌊' },
  { label: 'Haridwar',  icon: '🕌' },
  { label: 'Rishikesh', icon: '🌿' },
  { label: 'Pauri',     icon: '⛰' },
  { label: 'Tehri',     icon: '💧' },
];

const TYPES = [
  { label: 'All',          icon: '🏘', color: '#01696f', bg: '#e8f5f5' },
  { label: 'Residential',  icon: '🏠', color: '#1d6fbf', bg: '#e3f0fc' },
  { label: 'Commercial',   icon: '🏢', color: '#b45309', bg: '#fef3c7' },
  { label: 'Agricultural', icon: '🌾', color: '#166534', bg: '#dcfce7' },
  { label: 'Holiday Home', icon: '🏖', color: '#6d28d9', bg: '#ede9fe' },
];

// ─── HELPERS ──────────────────────────────────────────────────
const formatPrice = p => {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Crore`;
  if (p >= 100000)   return `₹${Math.round(p / 100000)} Lakh`;
  return `₹${p.toLocaleString('en-IN')}`;
};
const statusColor = s =>
  s === 'Available' ? '#16a34a' : s === 'Under Negotiation' ? '#ea580c' : '#dc2626';

// ─── AUTH HELPERS ─────────────────────────────────────────────
async function registerUser(email, password, role, profileData) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    role,
    ...profileData,
    status:    role === 'customer' ? 'active' : 'pending',
    createdAt: serverTimestamp(),
  });
  if (role === 'provider') {
    await setDoc(doc(db, 'services', cred.user.uid), {
      ...profileData,
      ownerId:   cred.user.uid,
      verified:  false,
      status:    'pending',
      available: true,
      createdAt: serverTimestamp(),
    });
  }
  if (role === 'rental_owner') {
    await setDoc(doc(db, 'rentals', cred.user.uid), {
      ...profileData,
      ownerId:   cred.user.uid,
      status:    'pending',
      createdAt: serverTimestamp(),
    });
  }
  return cred.user;
}

async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function getUserRole(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// ─────────────────────────────────────────────────────────────
// ─── SHARED FORM COMPONENTS (MODULE LEVEL — KEY FIX) ─────────
//  Defining Field & ChipSelect OUTSIDE any component prevents
//  React from remounting TextInputs on every keystroke, which
//  was causing the keyboard to dismiss after one character.
// ─────────────────────────────────────────────────────────────

function FormField({
  label,
  value,
  onChangeText,
  keyboard = 'default',
  secure = false,
  placeholder = '',
  multiline = false,
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: '#555', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        keyboardType={keyboard}
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={{
          backgroundColor: '#f7f8fa',
          borderRadius: 12,
          padding: 14,
          fontSize: 15,
          color: '#1a1a1a',
          borderWidth: 1,
          borderColor: '#e8e8e8',
          minHeight: multiline ? 96 : 50,
        }}
      />
    </View>
  );
}

function ChipSelect({ options, value, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 14 }}
      keyboardShouldPersistTaps="handled">
      {options.map(o => (
        <TouchableOpacity
          key={o}
          style={[styles.chip, value === o && styles.chipActive, { marginRight: 8 }]}
          onPress={() => onChange(o)}>
          <Text style={[styles.chipText, value === o && styles.chipTextActive]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── IMAGE GALLERY ────────────────────────────────────────────
function ImageGallery({ images }) {
  const [idx, setIdx] = useState(0);
  return (
    <View style={{ backgroundColor: '#000' }}>
      <ScrollView
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e =>
          setIdx(Math.round(e.nativeEvent.contentOffset.x / SW))
        }>
        {images.map((uri, i) => (
          <Image key={i} source={{ uri }}
            style={{ width: SW, height: 270 }} resizeMode="cover" />
        ))}
      </ScrollView>
      <View style={styles.imgCounter}>
        <Text style={styles.imgCounterText}>{idx + 1} / {images.length}</Text>
      </View>
      <View style={styles.dotRow}>
        {images.map((_, i) => (
          <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ─── WELCOME SCREEN ───────────────────────────────────────────
function WelcomeScreen({ onLogin }) {
  const [screen, setScreen] = useState('welcome');

  if (screen === 'login')
    return <LoginScreen onLogin={onLogin} onBack={() => setScreen('welcome')} />;
  if (screen === 'customer')
    return <RegisterForm role="customer" onLogin={onLogin} onBack={() => setScreen('roleSelect')} />;
  if (screen === 'provider')
    return <RegisterForm role="provider" onLogin={onLogin} onBack={() => setScreen('roleSelect')} />;
  if (screen === 'rental_owner')
    return <RegisterForm role="rental_owner" onLogin={onLogin} onBack={() => setScreen('roleSelect')} />;

  if (screen === 'roleSelect') return (
    <View style={{ flex: 1, backgroundColor: TEAL_DARK }}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <TouchableOpacity onPress={() => setScreen('welcome')} style={{ marginBottom: 24 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 6 }}>
          Who are you?
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 }}>
          Choose to create the right account
        </Text>
        {[
          { role: 'customer',     icon: '👤', title: 'Customer',        sub: 'Browse properties, rentals & hire services' },
          { role: 'provider',     icon: '🔧', title: 'Service Provider', sub: 'Register as plumber, electrician, maid, etc.' },
          { role: 'rental_owner', icon: '📦', title: 'Rental Owner',     sub: 'List your flat, vehicle, equipment for rent' },
        ].map(opt => (
          <TouchableOpacity key={opt.role}
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 16, padding: 18, marginBottom: 14,
              flexDirection: 'row', alignItems: 'center',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
            }}
            onPress={() => setScreen(opt.role)}>
            <Text style={{ fontSize: 32, marginRight: 16 }}>{opt.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>{opt.title}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{opt.sub}</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: TEAL_DARK }}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 60, textAlign: 'center' }}>🏔️</Text>
          <Text style={{ color: '#fff', fontSize: 36, fontWeight: '900', textAlign: 'center' }}>
            Nest<Text style={{ color: GOLD }}>Up</Text>
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontSize: 13, marginTop: 4 }}>
            Find your Nest in the Himalayas
          </Text>
        </View>
        {[
          '🏠 Buy & Sell Properties in Uttarakhand',
          '📦 Rent Flats, Bikes, Tents & Equipment',
          '🔧 Find Plumbers, Maids & Electricians',
        ].map(f => (
          <View key={f} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{f}</Text>
          </View>
        ))}
        <View style={{ width: '100%', marginTop: 40 }}>
          <TouchableOpacity
            style={{ backgroundColor: GOLD, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12 }}
            onPress={() => setScreen('roleSelect')}>
            <Text style={{ color: '#1a1a1a', fontWeight: '900', fontSize: 16 }}>Create Account →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14,
              padding: 16, alignItems: 'center', marginBottom: 12,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
            }}
            onPress={() => setScreen('login')}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>I already have an account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center', padding: 12 }}
            onPress={() => onLogin(null, 'guest')}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              Browse as Guest (no account needed)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────
function LoginScreen({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [err,   setErr]   = useState('');
  const [busy,  setBusy]  = useState(false);

  const doLogin = async () => {
    if (!email || !pass) { setErr('Please fill all fields'); return; }
    setBusy(true); setErr('');
    try {
      const cred = await loginUser(email.trim(), pass);
      const data = await getUserRole(cred.user.uid);
      onLogin(cred.user, data?.role || 'customer', data);
    } catch (e) {
      setErr(e.code === 'auth/invalid-credential' ? 'Wrong email or password' : e.message);
    } finally { setBusy(false); }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: TEAL_DARK, justifyContent: 'center', padding: 24 }}
      keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" />
      <TouchableOpacity onPress={onBack} style={{ marginBottom: 24 }}>
        <Text style={{ color: 'rgba(255,255,255,0.6)' }}>← Back</Text>
      </TouchableOpacity>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 6 }}>Welcome back 👋</Text>
      <Text style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>Sign in to your NestUp account</Text>

      <View style={{ marginBottom: 14 }}>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>EMAIL</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
          placeholderTextColor="rgba(255,255,255,0.3)"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}
        />
      </View>
      <View style={{ marginBottom: 14 }}>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>PASSWORD</Text>
        <TextInput
          value={pass}
          onChangeText={setPass}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Enter your password"
          placeholderTextColor="rgba(255,255,255,0.3)"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}
        />
      </View>

      {err ? <Text style={{ color: '#ff6b6b', marginBottom: 12, fontSize: 13 }}>⚠️ {err}</Text> : null}

      <TouchableOpacity
        style={{ backgroundColor: GOLD, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, opacity: busy ? 0.7 : 1 }}
        onPress={doLogin} disabled={busy}>
        <Text style={{ color: '#1a1a1a', fontWeight: '900', fontSize: 16 }}>
          {busy ? 'Signing in...' : 'Sign In →'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── REGISTER FORM ────────────────────────────────────────────
// FormField and ChipSelect are defined at module level above —
// that is what fixes the keyboard-dismissing bug.
function RegisterForm({ role, onLogin, onBack }) {
  const [step,        setStep]        = useState(1);
  const [busy,        setBusy]        = useState(false);
  const [err,         setErr]         = useState('');
  const [name,        setName]        = useState('');
  const [phone,       setPhone]       = useState('');
  const [email,       setEmail]       = useState('');
  const [pass,        setPass]        = useState('');
  const [category,    setCategory]    = useState('Plumber');
  const [experience,  setExperience]  = useState('');
  const [charge,      setCharge]      = useState('');
  const [area,        setArea]        = useState('');
  const [description, setDescription] = useState('');
  const [title,       setTitle]       = useState('');
  const [rentCat,     setRentCat]     = useState('Apartment');
  const [district,    setDistrict]    = useState('Dehradun');
  const [price,       setPrice]       = useState('');

  const totalSteps = role === 'customer' ? 2 : 3;
  const roleLabel = {
    customer:     { title: '👤 Customer Registration',     color: TEAL },
    provider:     { title: '🔧 Service Provider Register', color: '#1d6fbf' },
    rental_owner: { title: '📦 Rental Owner Register',     color: '#b45309' },
  }[role];

  const submit = async () => {
    setBusy(true); setErr('');
    try {
      let profileData = { name, phone };
      if (role === 'provider') {
        profileData = { name, phone, category, experience, charge, area, description, district: 'Dehradun', rating: 0, verified: false };
      }
      if (role === 'rental_owner') {
        profileData = { name, phone, title, category: rentCat, district, price: Number(price), priceUnit: '/month', description, available: true };
      }
      const user = await registerUser(email.trim(), pass, role, profileData);
      const data = await getUserRole(user.uid);
      onLogin(user, role, data);
    } catch (e) {
      setErr(e.code === 'auth/email-already-in-use' ? 'This email is already registered. Please login.' : e.message);
      setBusy(false);
    }
  };

  const goNext = () => {
    if (!name || !phone || !email || !pass) { setErr('Please fill all fields'); return; }
    setErr(''); setStep(s => s + 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={{ backgroundColor: roleLabel.color, paddingTop: SB_HEIGHT + 12, paddingHorizontal: 20, paddingBottom: 20 }}>
        <TouchableOpacity
          onPress={step > 1 ? () => setStep(s => s - 1) : onBack}
          style={{ marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>{roleLabel.title}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>
          Step {step} of {totalSteps}
        </Text>
        <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 12 }}>
          <View style={{ height: 4, width: `${(step / totalSteps) * 100}%`, backgroundColor: GOLD, borderRadius: 2 }} />
        </View>
      </View>

      {/* keyboardShouldPersistTaps="handled" keeps keyboard open when tapping inside scroll */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* STEP 1 — Basic Info */}
        {step === 1 && <>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 }}>
            Basic Information
          </Text>
          <FormField label="FULL NAME" value={name} onChangeText={setName} placeholder="Your full name" />
          <FormField label="PHONE NUMBER" value={phone} onChangeText={setPhone} keyboard="phone-pad" placeholder="+91 XXXXX XXXXX" />
          <FormField label="EMAIL ADDRESS" value={email} onChangeText={setEmail} keyboard="email-address" placeholder="you@example.com" />
          <FormField label="CREATE PASSWORD" value={pass} onChangeText={setPass} secure placeholder="Min 6 characters" />
        </>}

        {/* STEP 2 — Provider details */}
        {step === 2 && role === 'provider' && <>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 }}>
            Your Service Details
          </Text>
          <Text style={{ color: '#555', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>SERVICE CATEGORY</Text>
          <ChipSelect
            options={['Plumber', 'Electrician', 'Maid', 'Painter', 'Mason', 'Carpenter', 'Cook', 'AC Technician', 'Hair Cut', 'Masseur', 'Nanny', 'Packer & Movers', 'Fabricator', 'Cleaning', 'Handyman']}
            value={category} onChange={setCategory}
          />
          <FormField label="YEARS OF EXPERIENCE" value={experience} onChangeText={setExperience} keyboard="numeric" placeholder="e.g. 5 years" />
          <FormField label="CHARGE / RATE" value={charge} onChangeText={setCharge} placeholder="e.g. ₹500/visit or ₹800/day" />
          <FormField label="YOUR AREA / LOCALITY" value={area} onChangeText={setArea} placeholder="e.g. Rajpur Road, Dehradun" />
          <FormField label="ABOUT YOUR SERVICE" value={description} onChangeText={setDescription} placeholder="Describe your skills and experience..." multiline />
        </>}

        {/* STEP 2 — Rental owner details */}
        {step === 2 && role === 'rental_owner' && <>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 }}>
            Your Rental Details
          </Text>
          <FormField label="LISTING TITLE" value={title} onChangeText={setTitle} placeholder="e.g. 2BHK Furnished Flat, Honda Activa..." />
          <Text style={{ color: '#555', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>CATEGORY</Text>
          <ChipSelect
            options={['Apartment', 'House', 'Land', 'Bike', 'Car', 'Tent', 'Mattress', 'Furniture', 'Equipment']}
            value={rentCat} onChange={setRentCat}
          />
          <Text style={{ color: '#555', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>DISTRICT</Text>
          <ChipSelect
            options={['Dehradun', 'Mussoorie', 'Haridwar', 'Rishikesh', 'Nainital', 'Tehri', 'Pauri']}
            value={district} onChange={setDistrict}
          />
          <FormField label="MONTHLY RENT (₹)" value={price} onChangeText={setPrice} keyboard="numeric" placeholder="e.g. 12000" />
          <FormField label="DESCRIPTION" value={description} onChangeText={setDescription} placeholder="Describe the property or item..." multiline />
        </>}

        {/* STEP 2 — Customer confirmation */}
        {step === 2 && role === 'customer' && <>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 }}>
            You're all set! 🎉
          </Text>
          <View style={{ backgroundColor: TEAL_LIGHT, borderRadius: 16, padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🏔️</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: TEAL, textAlign: 'center' }}>
              Welcome to NestUp, {name}!
            </Text>
            <Text style={{ color: '#555', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
              You can now browse properties, rent items, and hire verified service providers across Uttarakhand.
            </Text>
          </View>
        </>}

        {/* STEP 3 — Review */}
        {step === 3 && <>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 }}>
            Review & Submit
          </Text>
          <View style={{ backgroundColor: '#f7f8fa', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            {[
              ['Name',  name],
              ['Phone', phone],
              ['Email', email],
              role === 'provider'     && ['Category',   category],
              role === 'provider'     && ['Experience', experience],
              role === 'provider'     && ['Charge',     charge],
              role === 'provider'     && ['Area',       area],
              role === 'rental_owner' && ['Title',      title],
              role === 'rental_owner' && ['Type',       rentCat],
              role === 'rental_owner' && ['District',   district],
              role === 'rental_owner' && ['Price',      `₹${price}/month`],
            ].filter(Boolean).map(([k, v]) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                <Text style={{ color: '#888', fontSize: 13 }}>{k}</Text>
                <Text style={{ color: '#1a1a1a', fontSize: 13, fontWeight: '700' }}>{v}</Text>
              </View>
            ))}
          </View>
          {role !== 'customer' && (
            <View style={{ backgroundColor: '#fff8e6', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#f0c040' }}>
              <Text style={{ color: '#b45309', fontSize: 13, fontWeight: '700' }}>⏳ Pending Approval</Text>
              <Text style={{ color: '#92400e', fontSize: 12, marginTop: 4, lineHeight: 18 }}>
                Your listing will be reviewed by the NestUp admin and activated within 24 hours.
              </Text>
            </View>
          )}
        </>}

        {err ? <Text style={{ color: '#dc2626', marginBottom: 12, fontSize: 13 }}>⚠️ {err}</Text> : null}
      </ScrollView>

      {/* Bottom Button */}
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' }}>
        <TouchableOpacity
          style={{
            backgroundColor: step === totalSteps ? GOLD : roleLabel.color,
            borderRadius: 14, padding: 16, alignItems: 'center',
            opacity: busy ? 0.7 : 1,
          }}
          onPress={step < totalSteps ? goNext : submit}
          disabled={busy}>
          <Text style={{ color: step === totalSteps ? '#1a1a1a' : '#fff', fontWeight: '900', fontSize: 16 }}>
            {busy ? 'Submitting...' : step < totalSteps ? 'Continue →' : '✓ Submit Registration'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────
function HomeScreen({ onSelect }) {
  const [region,      setRegion]      = useState('All');
  const [type,        setType]        = useState('All');
  const [search,      setSearch]      = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [properties,  setProperties]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onSnapshot(collection(db, 'properties'), snapshot => {
        const data = snapshot.docs.map(d => ({
          id:          d.id,
          status:      d.data().status      || 'Available',
          beds:        d.data().beds        || 'Plot',
          area:        d.data().area        || 'N/A',
          amenities:   Array.isArray(d.data().amenities) ? d.data().amenities : ['N/A'],
          images:      Array.isArray(d.data().images) && d.data().images.length > 0
                         ? d.data().images
                         : ['https://picsum.photos/seed/default/700/420'],
          description: d.data().description || 'Contact broker for details.',
          featured:    d.data().featured    || false,
          phone:       d.data().phone       || '+919368465774',
          lat:         d.data().lat         || 30.3165,
          lng:         d.data().lng         || 78.0322,
          region:      d.data().region      || d.data().district || 'Dehradun',
          ...d.data(),
        }));
        setProperties(data);
        setLoading(false);
      }, () => setLoading(false));
    } catch (e) {
      setLoading(false);
    }
    return () => unsub();
  }, []);

  const activeCount = (region !== 'All' ? 1 : 0) + (type !== 'All' ? 1 : 0);
  const clearAll = () => { setRegion('All'); setType('All'); setSearch(''); };

  const filtered = properties
    .map(p => ({ ...p, images: Array.isArray(p.images) ? p.images : [], amenities: Array.isArray(p.amenities) ? p.amenities : [] }))
    .filter(p => {
      const mR = region === 'All' || p.region === region || p.district === region;
      const mT = type   === 'All' || p.type === type;
      const mS = (p.district || '').toLowerCase().includes(search.toLowerCase()) ||
                 (p.title    || '').toLowerCase().includes(search.toLowerCase());
      return mR && mT && mS;
    });

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(1,77,82,0.95)', alignItems: 'center', justifyContent: 'center', zIndex: 99 }}>
          <Text style={{ fontSize: 40 }}>🏔️</Text>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 16 }}>Loading NestUp...</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 6 }}>Fetching properties from Uttarakhand</Text>
        </View>
      )}

      {/* Header */}
      <View style={[styles.header, { paddingTop: SB_HEIGHT + 8 }]}>
        <View style={styles.headerRow}>
          <View style={styles.logoMark}>
            <View style={styles.logoHouseRow}>
              <View style={styles.logoRoof} />
              <View style={styles.logoHouseBody}>
                <Text style={styles.logoArrow}>↑</Text>
              </View>
            </View>
          </View>
          <View style={styles.brandBlock}>
            <View style={styles.brandNameRow}>
              <Text style={styles.brandNest}>Nest</Text>
              <Text style={styles.brandUp}>Up</Text>
              <View style={{ width: 10 }} />
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            </View>
            <Text style={styles.tagline}>Find your Nest in the Himalayas</Text>
          </View>
          <View style={styles.statsPills}>
            <View style={styles.statPill}>
              <Text style={styles.statPillNum}>{properties.length}+</Text>
              <Text style={styles.statPillLabel}>Homes</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillNum}>8</Text>
              <Text style={styles.statPillLabel}>Districts</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search + Filter */}
      <View style={styles.searchFilterRow}>
        <View style={styles.searchBox}>
          <Text style={{ fontSize: 15, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search district or property..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 &&
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#aaa', fontSize: 18, paddingHorizontal: 6 }}>✕</Text>
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity
          style={[styles.filterToggleBtn, filtersOpen && { backgroundColor: TEAL_DARK }]}
          onPress={() => setFiltersOpen(p => !p)}>
          <Text style={{ fontSize: 17 }}>⚙️</Text>
          {activeCount > 0 && <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>{activeCount}</Text></View>}
          <Text style={styles.filterToggleChevron}>{filtersOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {filtersOpen && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterLabel}>📍 REGION</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} keyboardShouldPersistTaps="handled">
            {REGIONS.map(r => (
              <TouchableOpacity key={r.label} style={[styles.chip, region === r.label && styles.chipActive]} onPress={() => setRegion(r.label)}>
                <Text style={styles.chipIcon}>{r.icon}</Text>
                <Text style={[styles.chipText, region === r.label && styles.chipTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.filterLabel}>🏷 PROPERTY TYPE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} keyboardShouldPersistTaps="handled">
            {TYPES.map(t => (
              <TouchableOpacity key={t.label}
                style={[styles.typeChip, { backgroundColor: type === t.label ? t.color : t.bg }]}
                onPress={() => setType(t.label)}>
                <Text style={styles.chipIcon}>{t.icon}</Text>
                <Text style={[styles.typeChipText, { color: type === t.label ? '#fff' : t.color }]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.filterActionRow}>
            <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
              <Text style={styles.clearBtnText}>✕ Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setFiltersOpen(false)}>
              <Text style={styles.applyBtnText}>Apply Filters ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Active Filter Pills */}
      {!filtersOpen && activeCount > 0 && (
        <View style={styles.activePillsRow}>
          {region !== 'All' &&
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>📍 {region}</Text>
              <TouchableOpacity onPress={() => setRegion('All')}><Text style={styles.activePillX}> ✕</Text></TouchableOpacity>
            </View>
          }
          {type !== 'All' &&
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>{TYPES.find(t => t.label === type)?.icon} {type}</Text>
              <TouchableOpacity onPress={() => setType('All')}><Text style={styles.activePillX}> ✕</Text></TouchableOpacity>
            </View>
          }
          <TouchableOpacity onPress={clearAll}><Text style={styles.clearAll}>Clear all</Text></TouchableOpacity>
        </View>
      )}

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 12, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>🏔️</Text>
            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptySubtitle}>Try clearing your filters or search</Text>
          </View>
        }
        renderItem={({ item }) => {
          if (!item.title || !item.district) return null;
          const safe = {
            ...item,
            status:      item.status      || 'Available',
            beds:        item.beds        || 'Plot',
            area:        item.area        || 'N/A',
            amenities:   Array.isArray(item.amenities) && item.amenities.length > 0 ? item.amenities : ['Contact for details'],
            images:      Array.isArray(item.images) && item.images.length > 0 ? item.images : ['https://picsum.photos/seed/default/700/420'],
            description: item.description || 'Contact broker for more details.',
            phone:       item.phone       || '+919368465774',
          };
          const tc = TYPES.find(t => t.label === safe.type);
          return (
            <TouchableOpacity style={styles.card} onPress={() => onSelect(safe)} activeOpacity={0.93}>
              <View style={[styles.cardStatusStrip, { backgroundColor: statusColor(safe.status) }]} />
              <View style={{ flex: 1 }}>
                <View>
                  <Image source={{ uri: safe.images[0] }} style={styles.cardImage} resizeMode="cover" />
                  {safe.featured && <View style={styles.featuredBadge}><Text style={styles.featuredText}>⭐ Featured</Text></View>}
                  <View style={styles.priceOverlay}><Text style={styles.priceOverlayText}>{formatPrice(safe.price)}</Text></View>
                  <View style={styles.photoCount}><Text style={styles.photoCountText}>📷 {safe.images.length}</Text></View>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: tc?.color || TEAL }]}>
                      <Text style={styles.badgeText}>{tc?.icon} {safe.type}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: statusColor(safe.status) }]}>
                      <Text style={styles.badgeText}>{safe.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{safe.title}</Text>
                  <Text style={styles.cardDistrict}>📍 {safe.district}, Uttarakhand</Text>
                  <View style={styles.cardInfoRow}>
                    <View style={styles.infoChip}><Text style={styles.infoChipText}>🛏 {safe.beds}</Text></View>
                    <View style={styles.infoChip}><Text style={styles.infoChipText}>📐 {safe.area}</Text></View>
                    <View style={styles.infoChip}><Text style={styles.infoChipText}>✓ {safe.amenities[0]}</Text></View>
                  </View>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => onSelect(safe)}>
                    <Text style={styles.viewBtnText}>View Details →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ─── DETAIL SCREEN ────────────────────────────────────────────
function DetailScreen({ property, onBack }) {
  const tc = TYPES.find(t => t.label === property.type);
  const callBroker = () => Linking.openURL(`tel:${property.phone}`);
  const whatsapp   = () => {
    const msg = `Hi, I am interested in *${property.title}* in ${property.district}, Uttarakhand.\nPrice: ${formatPrice(property.price)} | Area: ${property.area}\nPlease share more details.\n(Property ID: ${property.id})\n\nVia NestUp App`;
    Linking.openURL(`https://wa.me/${property.phone.replace('+', '')}?text=${encodeURIComponent(msg)}`);
  };
  const openMaps   = () => Linking.openURL(`https://www.google.com/maps?q=${property.lat},${property.lng}`);
  const shareNow   = () => Share.share({
    message: `🏔 *${property.title}*\n📍 ${property.district}, Uttarakhand\n💰 ${formatPrice(property.price)} | 📐 ${property.area}\n\nContact: ${property.phone}\n\nVia NestUp`,
  });

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={[styles.detailNav, { paddingTop: SB_HEIGHT + 6 }]}>
        <TouchableOpacity style={styles.navBackBtn} onPress={onBack}>
          <Text style={styles.navBackText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.detailNavTitle} numberOfLines={1}>{property.title}</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={shareNow}>
          <Text style={styles.shareBtnText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery images={property.images} />
        <View style={styles.detailBody}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: tc?.color || TEAL }]}>
              <Text style={styles.badgeText}>{tc?.icon} {property.type}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusColor(property.status) }]}>
              <Text style={styles.badgeText}>{property.status}</Text>
            </View>
            {property.featured && <View style={[styles.badge, { backgroundColor: GOLD }]}><Text style={styles.badgeText}>⭐ Featured</Text></View>}
          </View>
          <Text style={styles.detailTitle}>{property.title}</Text>
          <Text style={styles.detailDistrict}>📍 {property.district}, Uttarakhand</Text>

          <View style={styles.priceCard}>
            <View style={styles.priceCardItem}>
              <Text style={styles.pcLabel}>Price</Text>
              <Text style={styles.pcValue}>{formatPrice(property.price)}</Text>
            </View>
            <View style={styles.pcDiv} />
            <View style={styles.priceCardItem}>
              <Text style={styles.pcLabel}>Area</Text>
              <Text style={styles.pcValue}>{property.area}</Text>
            </View>
            <View style={styles.pcDiv} />
            <View style={styles.priceCardItem}>
              <Text style={styles.pcLabel}>Size</Text>
              <Text style={styles.pcValue}>{property.beds}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About this Property</Text>
          <Text style={styles.description}>{property.description}</Text>

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesWrap}>
            {property.amenities.map(a => (
              <View key={a} style={styles.amenityChip}>
                <Text style={styles.amenityText}>✓ {a}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Your Broker</Text>
          <View style={styles.brokerCard}>
            <View style={styles.brokerAvatar}>
              <Text style={{ fontSize: 28 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.brokerName}>Bipin Badoni</Text>
                <View style={[styles.verifiedPill, { marginLeft: 8 }]}>
                  <Text style={styles.verifiedText}>✓ Verified</Text>
                </View>
              </View>
              <Text style={styles.brokerSub}>Uttarakhand Property Expert · 15+ Yrs</Text>
              <Text style={styles.brokerPhone}>📞 {property.phone}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity style={styles.mapBtn} onPress={openMaps}>
            <Text style={styles.mapBtnText}>📍 Open in Google Maps</Text>
          </TouchableOpacity>
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      <View style={styles.stickyBar}>
        <TouchableOpacity style={[styles.stickyBtn, { backgroundColor: TEAL }]} onPress={callBroker}>
          <Text style={styles.stickyIcon}>📞</Text>
          <Text style={styles.stickyTxt}>Call Broker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.stickyBtn, { backgroundColor: '#25D366' }]} onPress={whatsapp}>
          <Text style={styles.stickyIcon}>💬</Text>
          <Text style={styles.stickyTxt}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── RENTALS SCREEN ───────────────────────────────────────────
function RentalsScreen() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All');
  const CATS = ['All', 'Apartment', 'House', 'Land', 'Bike', 'Car', 'Tent', 'Mattress', 'Furniture', 'Equipment'];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'rentals'), snap => {
      const data = snap.docs
        .filter(d => d.data().status === 'active' || d.data().available === true)
        .map(d => ({ id: d.id, ...d.data() }));
      setRentals(data);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  const filtered = filter === 'All' ? rentals : rentals.filter(r => r.category === filter);

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={[styles.header, { paddingTop: SB_HEIGHT + 8, paddingBottom: 16 }]}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>📦 Rentals</Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 }}>Flats, Bikes, Tents & Equipment</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 50, paddingHorizontal: 12, paddingVertical: 8 }}
        keyboardShouldPersistTaps="handled">
        {CATS.map(c => (
          <TouchableOpacity key={c}
            style={[styles.chip, filter === c && styles.chipActive, { marginRight: 8 }]}
            onPress={() => setFilter(c)}>
            <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 36 }}>📦</Text>
          <Text style={{ color: '#888', marginTop: 10 }}>Loading rentals...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>📦</Text>
          <Text style={styles.emptyTitle}>No Rentals Yet</Text>
          <Text style={styles.emptySubtitle}>Rental owners can register and list their items here</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 12 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={[styles.card, { flexDirection: 'column' }]}>
              <View style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <View style={[styles.badge, { backgroundColor: TEAL, marginRight: 8 }]}>
                    <Text style={styles.badgeText}>{item.category}</Text>
                  </View>
                  {item.available && <View style={[styles.badge, { backgroundColor: '#16a34a' }]}><Text style={styles.badgeText}>Available</Text></View>}
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDistrict}>📍 {item.district}, Uttarakhand</Text>
                <Text style={{ color: TEAL, fontWeight: '800', fontSize: 15, marginTop: 6 }}>
                  ₹{item.price}{item.priceUnit || '/month'}
                </Text>
                {item.description ? <Text style={{ color: '#666', fontSize: 13, marginTop: 6, lineHeight: 18 }}>{item.description}</Text> : null}
                <TouchableOpacity
                  style={[styles.viewBtn, { marginTop: 12 }]}
                  onPress={() => Linking.openURL(`tel:${item.phone || '+919368465774'}`)}>
                  <Text style={styles.viewBtnText}>📞 Contact Owner</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ─── SERVICES SCREEN ──────────────────────────────────────────
function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');
  const CATS = ['All', 'Plumber', 'Electrician', 'Maid', 'Painter', 'Mason', 'Carpenter', 'Cook', 'AC Technician', 'Nanny', 'Cleaning', 'Handyman'];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), snap => {
      const data = snap.docs
        .filter(d => d.data().status === 'active' || d.data().verified === true)
        .map(d => ({ id: d.id, ...d.data() }));
      setServices(data);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  const filtered = filter === 'All' ? services : services.filter(s => s.category === filter);

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={[styles.header, { paddingTop: SB_HEIGHT + 8, paddingBottom: 16 }]}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>🔧 Services</Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 }}>Verified local professionals</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 50, paddingHorizontal: 12, paddingVertical: 8 }}
        keyboardShouldPersistTaps="handled">
        {CATS.map(c => (
          <TouchableOpacity key={c}
            style={[styles.chip, filter === c && styles.chipActive, { marginRight: 8 }]}
            onPress={() => setFilter(c)}>
            <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 36 }}>🔧</Text>
          <Text style={{ color: '#888', marginTop: 10 }}>Loading providers...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>🔧</Text>
          <Text style={styles.emptyTitle}>No Providers Yet</Text>
          <Text style={styles.emptySubtitle}>Service providers appear here once approved by admin</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 12 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={[styles.card, { flexDirection: 'column' }]}>
              <View style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TEAL_LIGHT, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 22 }}>🔧</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a1a1a' }}>{item.name}</Text>
                    <Text style={{ color: TEAL, fontSize: 12, fontWeight: '700' }}>{item.category}</Text>
                  </View>
                  {item.verified && <View style={styles.verifiedPill}><Text style={styles.verifiedText}>✓ Verified</Text></View>}
                </View>
                <Text style={{ color: '#555', fontSize: 13 }}>📍 {item.area}, {item.district}</Text>
                <Text style={{ color: '#777', fontSize: 13, marginTop: 4 }}>🕐 {item.experience} experience</Text>
                <Text style={{ color: TEAL, fontWeight: '800', fontSize: 14, marginTop: 4 }}>💰 {item.charge}</Text>
                {item.description ? <Text style={{ color: '#666', fontSize: 13, marginTop: 6 }}>{item.description}</Text> : null}
                <TouchableOpacity
                  style={[styles.viewBtn, { marginTop: 12, backgroundColor: '#25D366' }]}
                  onPress={() => Linking.openURL(`https://wa.me/${(item.phone || '').replace('+', '')}?text=${encodeURIComponent(`Hi ${item.name}, I found you on NestUp. I need your ${item.category} service.`)}`)}>
                  <Text style={styles.viewBtnText}>💬 WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────
function ProfileScreen({ user, userData, role, onLogout }) {
  const isPending = userData?.status === 'pending';
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={[styles.header, { paddingTop: SB_HEIGHT + 8, paddingBottom: 20 }]}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 36 }}>{role === 'provider' ? '🔧' : role === 'rental_owner' ? '📦' : '👤'}</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>{userData?.name || 'Guest'}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{user?.email}</Text>
          <View style={{ marginTop: 8, backgroundColor: isPending ? 'rgba(240,165,0,0.3)' : 'rgba(22,163,74,0.3)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ color: isPending ? GOLD : '#4ade80', fontSize: 12, fontWeight: '800' }}>
              {isPending ? '⏳ Pending Approval' : '✓ Active Account'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {isPending && role !== 'customer' && (
          <View style={{ backgroundColor: '#fff8e6', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#f0c040' }}>
            <Text style={{ color: '#b45309', fontWeight: '800', fontSize: 14, marginBottom: 4 }}>⏳ Your listing is under review</Text>
            <Text style={{ color: '#92400e', fontSize: 13, lineHeight: 20 }}>
              The NestUp admin will verify and activate your profile within 24 hours. You'll be visible to customers once approved.
            </Text>
          </View>
        )}

        <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' }}>
          {[
            { icon: '📞', label: 'Phone',    value: userData?.phone },
            { icon: '🏷',  label: 'Role',     value: role === 'provider' ? 'Service Provider' : role === 'rental_owner' ? 'Rental Owner' : 'Customer' },
            role === 'provider'     && { icon: '🔧', label: 'Category', value: userData?.category },
            role === 'provider'     && { icon: '📍', label: 'Area',     value: userData?.area },
            role === 'rental_owner' && { icon: '📦', label: 'Listing',  value: userData?.title },
          ].filter(Boolean).map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
              <Text style={{ fontSize: 20, marginRight: 14 }}>{item.icon}</Text>
              <View>
                <Text style={{ color: '#888', fontSize: 11, fontWeight: '700' }}>{item.label}</Text>
                <Text style={{ color: '#1a1a1a', fontSize: 14, fontWeight: '600', marginTop: 1 }}>{item.value || 'N/A'}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: '#fee2e2', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24, borderWidth: 1, borderColor: '#fecaca' }}
          onPress={onLogout}>
          <Text style={{ color: '#dc2626', fontWeight: '800', fontSize: 15 }}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [user,      setUser]      = useState(null);
  const [role,      setRole]      = useState(null);
  const [userData,  setUserData]  = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [booting,   setBooting]   = useState(true);
  const [bootError, setBootError] = useState('');

  useEffect(() => {
    // Timeout guard — if Firebase never responds, show error instead of freezing
    const timeout = setTimeout(() => {
      setBooting(false);
      setBootError('Startup took too long. Check Firebase config or internet.');
    }, 8000);

    let unsub = () => {};
    try {
      unsub = onAuthStateChanged(
        auth,
        async firebaseUser => {
          try {
            if (firebaseUser) {
              const data = await getUserRole(firebaseUser.uid);
              setUser(firebaseUser);
              setRole(data?.role || 'customer');
              setUserData(data);
            } else {
              setUser(null);
              setRole(null);
              setUserData(null);
            }
            setBootError('');
          } catch (e) {
            setBootError(e?.message || 'Failed to load user session');
          } finally {
            clearTimeout(timeout);
            setBooting(false);
          }
        },
        error => {
          clearTimeout(timeout);
          setBooting(false);
          setBootError(error?.message || 'Auth failed to initialize');
        },
      );
    } catch (e) {
      clearTimeout(timeout);
      setBooting(false);
      setBootError(e?.message || 'App startup error');
    }

    return () => { clearTimeout(timeout); unsub(); };
  }, []);

  // Booting splash
  if (booting) {
    return (
      <View style={{ flex: 1, backgroundColor: TEAL_DARK, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 50 }}>🏔️</Text>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 12 }}>NestUp</Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 8 }}>Starting app...</Text>
      </View>
    );
  }

  // Boot error screen
  if (bootError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 52, marginBottom: 10 }}>⚠️</Text>
        <Text style={{ color: '#1a1a1a', fontSize: 22, fontWeight: '900', textAlign: 'center' }}>
          App failed to load
        </Text>
        <Text style={{ color: '#666', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
          {bootError}
        </Text>
        <Text style={{ color: '#999', fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 20 }}>
          Fix: Check your firebaseConfig.js values and ensure all packages are installed.
        </Text>
      </View>
    );
  }

  // Not logged in
  if (!user && role !== 'guest') {
    return <WelcomeScreen onLogin={(u, r, d) => { setUser(u); setRole(r); setUserData(d); }} />;
  }

  function PropertiesStack() {
    return selected
      ? <DetailScreen property={selected} onBack={() => setSelected(null)} />
      : <HomeScreen onSelect={setSelected} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown:          false,
          tabBarActiveTintColor:   TEAL,
          tabBarInactiveTintColor: '#999',
          tabBarStyle:      { backgroundColor: '#fff', borderTopColor: '#eee', height: 62, paddingBottom: 8, paddingTop: 6 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        }}>
        <Tab.Screen name="Properties" component={PropertiesStack}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏠</Text> }} />
        <Tab.Screen name="Rentals" component={RentalsScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>📦</Text> }} />
        <Tab.Screen name="Services" component={ServicesScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🔧</Text> }} />
        <Tab.Screen name="Profile"
          options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>👤</Text> }}>
          {() => (
            <ProfileScreen
              user={user}
              userData={userData}
              role={role}
              onLogout={async () => {
                await signOut(auth);
                setUser(null); setRole(null); setUserData(null);
              }}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ─── STYLES ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  header:              { backgroundColor: TEAL_DARK, paddingHorizontal: 14, paddingBottom: 10 },
  headerRow:           { flexDirection: 'row', alignItems: 'center' },
  logoMark:            { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', padding: 4, marginRight: 10 },
  logoHouseRow:        { alignItems: 'center', justifyContent: 'center' },
  logoRoof:            { width: 0, height: 0, borderLeftWidth: 13, borderRightWidth: 13, borderBottomWidth: 11, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: GOLD, marginBottom: -1 },
  logoHouseBody:       { width: 18, height: 13, backgroundColor: '#fff', borderBottomLeftRadius: 2, borderBottomRightRadius: 2, alignItems: 'center', justifyContent: 'center' },
  logoArrow:           { fontSize: 11, fontWeight: '900', color: TEAL_DARK, lineHeight: 13 },
  brandBlock:          { flex: 1 },
  brandNameRow:        { flexDirection: 'row', alignItems: 'center' },
  brandNest:           { fontSize: 22, fontWeight: '900', color: '#fff' },
  brandUp:             { fontSize: 22, fontWeight: '900', color: GOLD },
  tagline:             { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 1, letterSpacing: 0.3 },
  verifiedPill:        { backgroundColor: 'rgba(240,165,0,0.2)', borderWidth: 1, borderColor: GOLD, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  verifiedText:        { color: GOLD, fontSize: 9, fontWeight: '700' },
  statsPills:          { flexDirection: 'row', marginLeft: 6 },
  statPill:            { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5, alignItems: 'center', marginLeft: 6 },
  statPillNum:         { color: '#fff', fontSize: 13, fontWeight: '800' },
  statPillLabel:       { color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 1 },
  searchFilterRow:     { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginTop: 10, marginBottom: 4 },
  searchBox:           { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, marginRight: 8 },
  searchInput:         { flex: 1, fontSize: 14, color: '#333' },
  filterToggleBtn:     { backgroundColor: TEAL, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', minWidth: 50 },
  filterToggleChevron: { fontSize: 9, color: 'rgba(255,255,255,0.8)', marginTop: 3, textAlign: 'center' },
  filterBadge:         { position: 'absolute', top: -5, right: -5, backgroundColor: GOLD, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: BG },
  filterBadgeText:     { color: '#fff', fontSize: 10, fontWeight: '900' },
  filtersPanel:        { backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 16, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  filterLabel:         { fontSize: 10, fontWeight: '800', color: '#999', marginBottom: 8, letterSpacing: 1 },
  chip:                { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, marginRight: 8, backgroundColor: '#f4f6f8', borderWidth: 1, borderColor: '#e0e0e0' },
  chipActive:          { backgroundColor: TEAL, borderColor: TEAL },
  chipIcon:            { fontSize: 13, marginRight: 4 },
  chipText:            { color: '#555', fontSize: 13, fontWeight: '600' },
  chipTextActive:      { color: '#fff' },
  typeChip:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, marginRight: 8 },
  typeChipText:        { fontSize: 13, fontWeight: '700' },
  filterActionRow:     { flexDirection: 'row', marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  clearBtn:            { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#ddd', alignItems: 'center', marginRight: 10 },
  clearBtnText:        { color: '#888', fontWeight: '700', fontSize: 13 },
  applyBtn:            { flex: 2, paddingVertical: 10, borderRadius: 10, backgroundColor: TEAL, alignItems: 'center' },
  applyBtnText:        { color: '#fff', fontWeight: '800', fontSize: 13 },
  activePillsRow:      { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginHorizontal: 12, marginBottom: 4 },
  activePill:          { flexDirection: 'row', alignItems: 'center', backgroundColor: TEAL_LIGHT, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#c8e6e7', marginRight: 8 },
  activePillText:      { color: TEAL, fontSize: 12, fontWeight: '700' },
  activePillX:         { color: TEAL, fontSize: 12, fontWeight: '900' },
  clearAll:            { fontSize: 12, color: TEAL, fontWeight: '700' },
  resultsRow:          { marginHorizontal: 12, marginBottom: 4 },
  resultsText:         { fontSize: 12, color: '#888', fontWeight: '600' },
  card:                { backgroundColor: '#fff', borderRadius: 18, marginBottom: 16, flexDirection: 'row', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, elevation: 4, overflow: 'hidden' },
  cardStatusStrip:     { width: 5 },
  cardImage:           { width: SW - 52, height: 190 },
  featuredBadge:       { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(240,165,0,0.92)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  featuredText:        { color: '#fff', fontWeight: '800', fontSize: 12 },
  priceOverlay:        { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(1,77,82,0.92)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  priceOverlayText:    { color: '#fff', fontWeight: '800', fontSize: 14 },
  photoCount:          { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  photoCountText:      { color: '#fff', fontSize: 11, fontWeight: '600' },
  cardBody:            { padding: 13 },
  badgeRow:            { flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap' },
  badge:               { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginRight: 6, marginBottom: 4 },
  badgeText:           { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardTitle:           { fontSize: 17, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  cardDistrict:        { color: '#777', fontSize: 13, marginBottom: 10 },
  cardInfoRow:         { flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap' },
  infoChip:            { backgroundColor: '#f4f6f8', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginRight: 6, marginBottom: 4 },
  infoChipText:        { color: '#555', fontSize: 12, fontWeight: '600' },
  viewBtn:             { backgroundColor: TEAL, borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  viewBtnText:         { color: '#fff', fontWeight: '800', fontSize: 14 },
  empty:               { alignItems: 'center', paddingVertical: 60 },
  emptyTitle:          { fontSize: 18, fontWeight: 'bold', color: '#444', marginTop: 14 },
  emptySubtitle:       { color: '#aaa', fontSize: 13, marginTop: 6, textAlign: 'center', paddingHorizontal: 30 },
  imgCounter:          { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  imgCounterText:      { color: '#fff', fontSize: 12, fontWeight: '700' },
  dotRow:              { position: 'absolute', bottom: 12, flexDirection: 'row', justifyContent: 'center', width: '100%' },
  dot:                 { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
  dotActive:           { backgroundColor: '#fff', width: 18 },
  detailNav:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: TEAL_DARK, paddingHorizontal: 12, paddingBottom: 12 },
  navBackBtn:          { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  navBackText:         { color: '#fff', fontWeight: '700', fontSize: 14 },
  detailNavTitle:      { color: '#fff', fontWeight: 'bold', fontSize: 15, flex: 1, textAlign: 'center', marginHorizontal: 8 },
  shareBtn:            { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  shareBtnText:        { color: '#fff', fontSize: 13, fontWeight: '700' },
  detailBody:          { padding: 16 },
  detailTitle:         { fontSize: 22, fontWeight: '900', color: '#1a1a1a', marginTop: 10, marginBottom: 4 },
  detailDistrict:      { color: '#777', fontSize: 14, marginBottom: 14 },
  priceCard:           { flexDirection: 'row', backgroundColor: TEAL_LIGHT, borderRadius: 16, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: '#c8e6e7' },
  priceCardItem:       { flex: 1, alignItems: 'center' },
  pcLabel:             { fontSize: 10, color: '#888', fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  pcValue:             { fontSize: 15, fontWeight: '800', color: TEAL },
  pcDiv:               { width: 1, backgroundColor: '#c8e6e7', marginVertical: 4 },
  sectionTitle:        { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 10, marginTop: 8 },
  description:         { color: '#555', fontSize: 14, lineHeight: 23 },
  amenitiesWrap:       { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  amenityChip:         { backgroundColor: TEAL_LIGHT, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#c8e6e7', marginRight: 8, marginBottom: 8 },
  amenityText:         { color: TEAL, fontSize: 13, fontWeight: '700' },
  brokerCard:          { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e8e8e8', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 6 },
  brokerAvatar:        { width: 54, height: 54, borderRadius: 27, backgroundColor: TEAL_LIGHT, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  brokerName:          { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
  brokerSub:           { color: '#888', fontSize: 12, marginTop: 2 },
  brokerPhone:         { color: TEAL, fontSize: 13, fontWeight: '700', marginTop: 4 },
  mapBtn:              { backgroundColor: '#fff', borderWidth: 1.5, borderColor: TEAL, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 4 },
  mapBtnText:          { color: TEAL, fontWeight: '800', fontSize: 15 },
  stickyBar:           { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 8 },
  stickyBtn:           { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, marginHorizontal: 5 },
  stickyIcon:          { fontSize: 17, marginRight: 6 },
  stickyTxt:           { color: '#fff', fontWeight: '800', fontSize: 15 },
});
