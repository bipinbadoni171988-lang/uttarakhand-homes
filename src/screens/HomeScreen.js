import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';

import CategoryBanner from '../components/CategoryBanner';
import TrendingCard from '../components/TrendingCard';
import PermissionModal from '../components/PermissionModal';
import usePermissions from '../hooks/usePermissions';
import useLocation from '../hooks/useLocation';
import { db } from '../../firebaseConfig';
import { TEAL, TEAL_DARK, GOLD, BG, SB_HEIGHT } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [trendingRentals, setTrendingRentals] = useState([]);
  const [trendingServices, setTrendingServices] = useState([]);

  const permissionModalProps = usePermissions();
  useLocation();

  useEffect(() => {
    const propertiesUnsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const properties = snapshot.docs.slice(0, 4).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrendingProperties(properties);
    });

    const rentalsUnsubscribe = onSnapshot(collection(db, 'rentals'), (snapshot) => {
      const rentals = snapshot.docs.slice(0, 4).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrendingRentals(rentals);
    });

    const servicesUnsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const services = snapshot.docs.slice(0, 4).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrendingServices(services);
    });

    return () => {
      propertiesUnsubscribe();
      rentalsUnsubscribe();
      servicesUnsubscribe();
    };
  }, []);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>🏔️</Text>
            <Text style={styles.logoNest}>Nest</Text>
            <Text style={styles.logoUp}>Up</Text>
          </View>

          <Text style={styles.tagline}>Find your Nest in the Himalayas</Text>
          <Text style={styles.greeting}>What do you want to search today?</Text>
        </View>

        <View style={styles.categoriesSection}>
          <CategoryBanner
            emoji="🏠"
            title="Properties for Sale"
            subtitle="Buy verified homes across Uttarakhand"
            ctaText="Browse Properties →"
            gradientFrom="#01696f"
            onPress={() => navigation.navigate('Properties')}
          />

          <CategoryBanner
            emoji="📦"
            title="Rentals"
            subtitle="Flats, bikes, tents & equipment for rent"
            ctaText="Browse Rentals →"
            gradientFrom="#1d6fbf"
            onPress={() => navigation.navigate('Rentals')}
          />

          <CategoryBanner
            emoji="🔧"
            title="Services"
            subtitle="Hire verified local professionals"
            ctaText="Find Services →"
            gradientFrom="#b45309"
            onPress={() => navigation.navigate('Services')}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Properties</Text>
            <Pressable onPress={() => navigation.navigate('Properties')}>
              <Text style={styles.seeAll}>See All →</Text>
            </Pressable>
          </View>

          <FlatList
            horizontal
            data={trendingProperties}
            keyExtractor={(item, index) => item?.id || `property-${index}`}
            renderItem={({ item }) => <TrendingCard item={item} variant="property" />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📦 Trending Rentals</Text>
            <Pressable onPress={() => navigation.navigate('Rentals')}>
              <Text style={styles.seeAll}>See All →</Text>
            </Pressable>
          </View>

          <FlatList
            horizontal
            data={trendingRentals}
            keyExtractor={(item, index) => item?.id || `rental-${index}`}
            renderItem={({ item }) => <TrendingCard item={item} variant="rental" />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔧 Popular Services</Text>
            <Pressable onPress={() => navigation.navigate('Services')}>
              <Text style={styles.seeAll}>See All →</Text>
            </Pressable>
          </View>

          <FlatList
            horizontal
            data={trendingServices}
            keyExtractor={(item, index) => item?.id || `service-${index}`}
            renderItem={({ item }) => <TrendingCard item={item} variant="service" />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>

      <PermissionModal {...permissionModalProps} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    backgroundColor: TEAL_DARK,
    paddingTop: SB_HEIGHT + 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    marginRight: 4,
    fontWeight: '900',
  },
  logoNest: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  logoUp: {
    color: GOLD,
    fontSize: 28,
    fontWeight: '900',
  },
  tagline: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  greeting: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  categoriesSection: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  section: {
    marginTop: 22,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    color: TEAL,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
});

export { HomeScreen };
export default HomeScreen;
