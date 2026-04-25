import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';

export default function ServicesScreen() {
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
  };

  return (
    <View style={styles.container}>
      <Animated.View pointerEvents="none" style={[styles.toast, { opacity: toastOpacity }]}>
        <Text style={styles.toastText}>📍 Showing results near you</Text>
      </Animated.View>

      <Text style={styles.title}>Services</Text>
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
