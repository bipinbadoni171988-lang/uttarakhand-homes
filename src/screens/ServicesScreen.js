import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { collection, onSnapshot, query } from 'firebase/firestore';

import FilterBar from '../components/FilterBar';
import { SERVICE_CATS } from '../constants/data';
import { db } from '../firebase/config';

export const ServicesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');

  useEffect(() => {
    let mounted = true;

    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' && mounted) {
        Alert.alert(
          'Location Permission',
          'Location access is optional, but helps show services near you.'
        );
      }
    };

    requestLocationPermission();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const servicesRef = collection(db, 'services');
    const servicesQuery = query(servicesRef);

    const unsubscribe = onSnapshot(
      servicesQuery,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.verified === true || item.status === 'active');
        setServices(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading services:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredServices = useMemo(() => {
    if (!selectedCat || selectedCat === 'All') {
      return services;
    }

    return services.filter((item) => item.category === selectedCat);
  }, [services, selectedCat]);

  const handleWhatsApp = async (phone) => {
    if (!phone) {
      Alert.alert('No contact', 'WhatsApp number is not available.');
      return;
    }

    const cleaned = String(phone).replace(/[^\d]/g, '');
    const url = `https://wa.me/${cleaned}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert('Unavailable', 'WhatsApp is not available on this device.');
      return;
    }

    await Linking.openURL(url);
  };

  const renderItem = ({ item }) => {
    const description = item.description || '';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation?.navigate?.('ServiceDetails', { serviceId: item.id })}
      >
        <View style={styles.row}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{item.emoji || '🧰'}</Text>
          </View>

          <View style={styles.infoWrap}>
            <Text style={styles.name}>{item.name || 'Unnamed service provider'}</Text>
            <Text style={styles.cat}>{item.category || 'Service'}</Text>
            <Text style={styles.meta}>{item.area || item.district || 'Unknown location'}</Text>
            <Text style={styles.meta}>Experience: {item.experience || 'N/A'}</Text>
            <Text style={styles.charge}>Charge: {item.charge || item.price || 'N/A'}</Text>
          </View>
        </View>

        {!!description && <Text style={styles.description}>{description}</Text>}

        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={() => handleWhatsApp(item.whatsapp || item.phone || item.contact)}
        >
          <Text style={styles.whatsappText}>💬 WhatsApp</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔧 Services</Text>
        <Text style={styles.headerSubtitle}>Verified local professionals</Text>
      </View>

      <FilterBar
        categories={SERVICE_CATS}
        selectedCategory={selectedCat}
        onSelectCategory={setSelectedCat}
        screenType="service"
      />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#b45309" />
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No services found.</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#b45309',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSubtitle: { color: '#ffedd5', marginTop: 4, fontSize: 14 },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 12, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  row: { flexDirection: 'row' },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarEmoji: { fontSize: 24 },
  infoWrap: { flex: 1 },
  name: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  cat: { marginTop: 4, color: '#0f766e', fontWeight: '700' },
  meta: { marginTop: 4, color: '#475569' },
  charge: { marginTop: 6, fontWeight: '800', color: '#7c2d12' },
  description: { marginTop: 12, color: '#334155', lineHeight: 20 },
  whatsappBtn: {
    marginTop: 12,
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  whatsappText: { color: '#fff', fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 28, color: '#64748b' },
});

export default ServicesScreen;
import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function ServicesScreen() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServices(data);

      if (data.length === 0) {
        import('../constants/mockData').then((m) => setServices(m.MOCK_SERVICES));
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
