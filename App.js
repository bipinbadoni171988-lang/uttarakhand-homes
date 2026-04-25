import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SeedDataScreen from './src/screens/SeedDataScreen';

// Replace this with your real app navigator/component once auth checks pass.
const TabNavigator = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Main TabNavigator Placeholder</Text>
  </View>
);

export default function App() {
  const [showSeedScreen, setShowSeedScreen] = useState(false);

  // Replace this with your real auth checks.
  const authChecksPassed = true;

  if (!authChecksPassed) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Auth flow placeholder</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TabNavigator />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowSeedScreen(true)}
        style={styles.seedFab}
      >
        <Text style={styles.seedFabText}>🌱</Text>
      </TouchableOpacity>

      <Modal animationType="slide" visible={showSeedScreen}>
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setShowSeedScreen(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>
          <SeedDataScreen />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#333',
  },
  seedFab: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: '#ff4444',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  seedFabText: {
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
