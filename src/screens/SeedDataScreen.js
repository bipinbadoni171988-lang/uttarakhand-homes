import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { db } from '../../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import { MOCK_PROPERTIES, MOCK_RENTALS, MOCK_SERVICES } from '../constants/mockData';
import { TEAL, GOLD, BG, TEAL_DARK } from '../constants/theme';

const SeedDataScreen = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const addResult = (message) => {
    setResults((prev) => [...prev, message]);
  };

  const seedProperties = async () => {
    for (const item of MOCK_PROPERTIES) {
      try {
        await setDoc(doc(collection(db, 'properties'), item.id), item);
        addResult(`✅ Property: ${item.title}`);
      } catch (error) {
        addResult(`❌ Failed: ${item.title}`);
      }
    }
  };

  const seedRentals = async () => {
    for (const item of MOCK_RENTALS) {
      try {
        await setDoc(doc(collection(db, 'rentals'), item.id), item);
        addResult(`✅ Rental: ${item.title}`);
      } catch (error) {
        addResult(`❌ Failed: ${item.title}`);
      }
    }
  };

  const seedServices = async () => {
    for (const item of MOCK_SERVICES) {
      try {
        await setDoc(doc(collection(db, 'services'), item.id), item);
        addResult(`✅ Service: ${item.title}`);
      } catch (error) {
        addResult(`❌ Failed: ${item.title}`);
      }
    }
  };

  const seedAll = async () => {
    setLoading(true);
    try {
      await seedProperties();
      await seedRentals();
      await seedServices();
      Alert.alert('Done', 'All 30 records seeded to Firestore!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌱 Dev: Seed Test Data</Text>
        </View>

        <TouchableOpacity style={[styles.button, styles.propertiesButton]} onPress={seedProperties}>
          <Text style={styles.buttonText}>🏠 Seed 10 Properties</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.rentalsButton]} onPress={seedRentals}>
          <Text style={styles.buttonText}>📦 Seed 10 Rentals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.servicesButton]} onPress={seedServices}>
          <Text style={styles.buttonText}>🔧 Seed 10 Services</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.allButton]} onPress={seedAll}>
          <Text style={styles.allButtonText}>🚀 Seed ALL 30 Records</Text>
        </TouchableOpacity>

        <ScrollView style={styles.resultsBox}>
          {results.map((line, index) => (
            <Text key={`${line}-${index}`} style={styles.resultLine}>
              {line}
            </Text>
          ))}
        </ScrollView>

        <Text style={styles.warningText}>
          ⚠️ Dev only — remove this screen before production release
        </Text>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={GOLD} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  header: {
    backgroundColor: TEAL_DARK,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  propertiesButton: {
    backgroundColor: TEAL,
  },
  rentalsButton: {
    backgroundColor: '#1d6fbf',
  },
  servicesButton: {
    backgroundColor: '#b45309',
  },
  allButton: {
    backgroundColor: GOLD,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  allButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  resultsBox: {
    height: 300,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  resultLine: {
    color: '#4ade80',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  warningText: {
    color: '#ef4444',
    fontSize: 11,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SeedDataScreen;
