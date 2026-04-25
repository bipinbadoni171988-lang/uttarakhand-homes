import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';

export default function PropertyScreen() {
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';

import { db } from '../firebase';
import FilterBar from '../components/FilterBar';
import PermissionModal from '../components/PermissionModal';
import PropertyDetailScreen from './PropertyDetailScreen';
import { usePermissions } from '../hooks/usePermissions';
import { useLocation } from '../hooks/useLocation';

const TEAL_DARK = '#0f766e';
const TEAL = '#14b8a6';
const BG = '#f8fafc';
const CARD_BG = '#ffffff';
const TEXT_DARK = '#0f172a';
const TEXT_MUTED = '#64748b';

const STATUS_COLORS = {
  available: '#16a34a',
  sold: '#dc2626',
  pending: '#f59e0b',
};

const { width } = Dimensions.get('window');
const SB_HEIGHT = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight ?? 0,
  default: 0,
});

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizeProperty = (id, data = {}) => ({
  id,
  title: data.title ?? 'Untitled Property',
  district: data.district ?? 'Unknown District',
  region: data.region ?? data.district ?? 'Unknown Region',
  type: data.type ?? 'Unknown',
  status: String(data.status ?? 'available').toLowerCase(),
  beds: Number.isFinite(data.beds) ? data.beds : 0,
  area: data.area ?? 'N/A',
  price: data.price ?? null,
  description: data.description ?? '',
  images: toArray(data.images).filter(Boolean),
  amenities: toArray(data.amenities).filter(Boolean),
  location: data.location ?? null,
  contact: data.contact ?? null,
  createdAt: data.createdAt ?? null,
});

const inferClosestDistrict = (locationResult) => {
  if (!locationResult || typeof locationResult !== 'object') return 'All';

  const candidates = [
    locationResult.closestDistrict,
    locationResult.district,
    locationResult.region,
    locationResult.address?.district,
    locationResult.address?.city,
    locationResult.address?.subregion,
  ].filter(Boolean);

  return candidates[0] ?? 'All';
};

const statusColor = (status) => STATUS_COLORS[String(status).toLowerCase()] ?? '#0ea5e9';

const getShareMessage = (property) => {
  const lines = [
    property?.title,
    property?.district ? `District: ${property.district}` : null,
    property?.type ? `Type: ${property.type}` : null,
    property?.price ? `Price: ${property.price}` : null,
  ].filter(Boolean);

  return lines.join('\n');
};

export const PropertyScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');

  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissionType, setPermissionType] = useState('location');

  const { requestPermission } = usePermissions();
  const { requestLocation } = useLocation();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'properties'),
      (snapshot) => {
        const next = snapshot.docs.map((doc) => normalizeProperty(doc.id, doc.data()));
        setProperties(next);
        setLoading(false);
      },
      () => {
        setProperties([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const filteredProperties = useMemo(() => {
    const term = search.trim().toLowerCase();

    return properties.filter((item) => {
      const regionMatch = region === 'All' || item.region === region || item.district === region;
      const typeMatch = type === 'All' || item.type === type;
      const searchMatch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.district.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term);

      return regionMatch && typeMatch && searchMatch;
    });
  }, [properties, region, type, search]);

  const closePermissionModal = useCallback(() => {
    setPermissionModalVisible(false);
  }, []);

  const handleLocationFilterTap = useCallback(() => {
    setPermissionType('location');
    setPermissionModalVisible(true);
  }, []);

  const handleShareTap = useCallback(() => {
    setPermissionType('contacts');
    setPermissionModalVisible(true);
  }, []);

  const handlePermissionAllow = useCallback(async () => {
    try {
      const granted = await requestPermission(permissionType);
      if (!granted) {
        closePermissionModal();
        return;
      }

      if (permissionType === 'location') {
        const locationResult = await requestLocation();
        const closestDistrict = inferClosestDistrict(locationResult);
        setRegion(closestDistrict || 'All');
      }

      if (permissionType === 'contacts' && selectedProperty) {
        await Share.share({
          message: getShareMessage(selectedProperty),
          title: selectedProperty.title,
        });
      }
    } finally {
      closePermissionModal();
    }
  }, [closePermissionModal, permissionType, requestLocation, requestPermission, selectedProperty]);

  if (selectedProperty) {
    return (
      <View style={styles.detailContainer}>
        <PropertyDetailScreen
          navigation={navigation}
          property={selectedProperty}
          onBack={() => setSelectedProperty(null)}
          onShare={handleShareTap}
        />
        <PermissionModal
          visible={permissionModalVisible}
          type={permissionType}
          onClose={closePermissionModal}
          onAllow={handlePermissionAllow}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.loadingEmoji}>🏡</Text>
        <ActivityIndicator size="large" color={TEAL_DARK} />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const mainImage = item.images[0] || 'https://via.placeholder.com/900x500?text=Property';
    const leadAmenity = item.amenities[0] || 'No amenities listed';

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setSelectedProperty(item)}>
        <Image source={{ uri: mainImage }} style={styles.cardImage} resizeMode="cover" />
        <View style={[styles.statusStrip, { backgroundColor: statusColor(item.status) }]} />

        <View style={styles.cardBody}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.type}</Text>
            </View>
            <View style={[styles.badge, styles.statusBadge]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.district}>{item.district}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipText}>🛏 {item.beds} beds</Text>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipText}>📐 {item.area}</Text>
            </View>
            <View style={styles.infoChip}>
              <Text numberOfLines={1} style={styles.infoChipText}>
                ✨ {leadAmenity}
              </Text>
            </View>
          </View>

          <View style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details →</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View pointerEvents="none" style={[styles.toast, { opacity: toastOpacity }]}>
        <Text style={styles.toastText}>📍 Showing results near you</Text>
      </Animated.View>

      <Text style={styles.title}>Properties</Text>
      <TouchableOpacity style={styles.button} onPress={detectLocation} disabled={isLocating}>
        <Text style={styles.buttonText}>{isLocating ? 'Detecting…' : 'Use my location'}</Text>
      </TouchableOpacity>
    </View>
  );
}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏠 Properties for Sale</Text>
        <Text style={styles.headerSubtitle}>{filteredProperties.length} listings found</Text>
      </View>

      <FilterBar
        screenType="property"
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        region={region}
        setRegion={setRegion}
        type={type}
        setType={setType}
        search={search}
        setSearch={setSearch}
        onLocationFilterPress={handleLocationFilterTap}
      />

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredProperties.length === 0 ? styles.emptyListContent : styles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptySubtitle}>Try changing your region, type, or search terms.</Text>
          </View>
        }
      />

      <PermissionModal
        visible={permissionModalVisible}
        type={permissionType}
        onClose={closePermissionModal}
        onAllow={handlePermissionAllow}
      />
    </View>
  );
};

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
    backgroundColor: BG,
  },
  header: {
    backgroundColor: TEAL_DARK,
    paddingTop: SB_HEIGHT + 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#ccfbf1',
    marginTop: 4,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 14,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: width - 28,
    alignSelf: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.09,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  statusStrip: {
    height: 5,
    width: '100%',
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadge: {
    backgroundColor: '#ccfbf1',
  },
  badgeText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  title: {
    color: TEXT_DARK,
    fontWeight: '800',
    fontSize: 17,
  },
  district: {
    color: TEXT_MUTED,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  infoChip: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  infoChipText: {
    color: '#334155',
    fontSize: 12,
    maxWidth: width - 80,
  },
  viewButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#ccfbf1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  viewButtonText: {
    color: TEAL_DARK,
    fontWeight: '800',
    fontSize: 13,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG,
    gap: 10,
  },
  loadingEmoji: {
    fontSize: 36,
  },
  loadingText: {
    color: TEXT_MUTED,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyWrap: {
    alignItems: 'center',
    gap: 6,
  },
  emptyEmoji: {
    fontSize: 34,
  },
  emptyTitle: {
    color: TEXT_DARK,
    fontWeight: '800',
    fontSize: 20,
  },
  emptySubtitle: {
    color: TEXT_MUTED,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: BG,
  },
});

export default PropertyScreen;
import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function PropertyScreen() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProperties(data);

      if (data.length === 0) {
        import('../constants/mockData').then((m) => setProperties(m.MOCK_PROPERTIES));
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
