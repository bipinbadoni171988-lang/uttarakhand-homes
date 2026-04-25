import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';

export default function RentalsScreen() {
  const [isLocating, setIsLocating] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showNearbyToast = () => {
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }).start();
      }, 3000);
    });
  };

  const detectLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      showNearbyToast();
    } finally {
      setIsLocating(false);
    }
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
import { RENTAL_CATS } from '../constants/data';
import { db } from '../firebase/config';

export const RentalsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');

  useEffect(() => {
    let mounted = true;

    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' && mounted) {
        Alert.alert(
          'Location Permission',
          'Location access is optional, but helps show listings near you.'
        );
      }
    };

    requestLocationPermission();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const rentalsRef = collection(db, 'rentals');
    const rentalsQuery = query(rentalsRef);

    const unsubscribe = onSnapshot(
      rentalsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRentals(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading rentals:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredRentals = useMemo(() => {
    if (!selectedCat || selectedCat === 'All') {
      return rentals;
    }

    return rentals.filter((item) => item.category === selectedCat);
  }, [rentals, selectedCat]);

  const handleCallOwner = async (phone) => {
    if (!phone) {
      Alert.alert('No contact', 'Phone number is not available for this listing.');
      return;
    }

    const cleaned = String(phone).replace(/[^+\d]/g, '');
    const url = `tel:${cleaned}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert('Unavailable', 'Calling is not supported on this device.');
      return;
    }

    await Linking.openURL(url);
  };

  const renderItem = ({ item }) => {
    const description = item.description || '';
    const snippet = description.length > 100 ? `${description.slice(0, 100)}…` : description;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation?.navigate?.('RentalDetails', { rentalId: item.id })}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.catBadge}>{item.category || 'Rental'}</Text>
        </View>

        <Text style={styles.title}>{item.title || 'Untitled rental'}</Text>
        <Text style={styles.meta}>{item.district || 'Unknown district'}</Text>
        <Text style={styles.price}>₹{item.price || item.pricePerMonth || 'N/A'} / month</Text>

        {!!snippet && <Text style={styles.description}>{snippet}</Text>}

        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => handleCallOwner(item.phone || item.contact || item.ownerPhone)}
        >
          <Text style={styles.callBtnText}>📞 Contact Owner</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View pointerEvents="none" style={[styles.toast, { opacity: toastOpacity }]}>
        <Text style={styles.toastText}>📍 Showing results near you</Text>
      </Animated.View>

      <Text style={styles.title}>Rentals</Text>
      <TouchableOpacity style={styles.button} onPress={detectLocation} disabled={isLocating}>
        <Text style={styles.buttonText}>{isLocating ? 'Detecting…' : 'Use my location'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fbfb',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 20,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#01696f',
    borderRadius: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
});
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📦 Rentals</Text>
        <Text style={styles.headerSubtitle}>Flats, bikes, tents & equipment</Text>
      </View>

      <FilterBar
        categories={RENTAL_CATS}
        selectedCategory={selectedCat}
        onSelectCategory={setSelectedCat}
        screenType="rental"
      />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#1d6fbf" />
        </View>
      ) : (
        <FlatList
          data={filteredRentals}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No rentals found.</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#1d6fbf',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSubtitle: { color: '#dbeafe', marginTop: 4, fontSize: 14 },
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
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  title: { marginTop: 10, fontSize: 18, fontWeight: '800', color: '#0f172a' },
  meta: { marginTop: 4, fontSize: 13, color: '#475569' },
  price: { marginTop: 8, fontSize: 17, fontWeight: '800', color: '#0f766e' },
  description: { marginTop: 8, color: '#334155', lineHeight: 20 },
  callBtn: {
    marginTop: 12,
    backgroundColor: '#1d6fbf',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  callBtnText: { color: '#fff', fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 28, color: '#64748b' },
});

export default RentalsScreen;
import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function RentalsScreen() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rentals'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRentals(data);

      if (data.length === 0) {
        import('../constants/mockData').then((m) => setRentals(m.MOCK_RENTALS));
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
