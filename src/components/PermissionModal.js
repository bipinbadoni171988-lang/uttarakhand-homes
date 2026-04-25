import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const CARD_OFFSET = 340;

export default function PermissionModal({ visible, onAllow, onDeny }) {
  const slideY = useRef(new Animated.Value(CARD_OFFSET)).current;
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(slideY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(slideY, {
      toValue: CARD_OFFSET,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsMounted(false);
      }
    });
  }, [visible, slideY]);

  const dismissWithSlide = callback => {
    Animated.timing(slideY, {
      toValue: CARD_OFFSET,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && typeof callback === 'function') {
        callback();
      }
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => dismissWithSlide(onDeny)}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ translateY: slideY }] }] }>
          <Text style={styles.title}>Enable Location</Text>
          <Text style={styles.message}>
            Allow location access to show nearby results.
          </Text>

          <View style={styles.row}>
            <Pressable onPress={() => dismissWithSlide(onDeny)} style={[styles.button, styles.secondary]}>
              <Text style={styles.secondaryText}>Not Now</Text>
            </Pressable>
            <Pressable onPress={() => dismissWithSlide(onAllow)} style={[styles.button, styles.primary]}>
              <Text style={styles.primaryText}>Allow</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TEAL, GOLD } from '../constants/theme';

export const PermissionModal = ({ visible, type, onAllow, onDeny }) => {
  const isLocation = type === 'location';

  const content = isLocation
    ? {
        emoji: '📍',
        title: 'Allow Location Access',
        subtitle:
          'NestUp wants to show properties near you automatically. Your location is never stored or shared.',
        allowLabel: 'Allow Location',
        denyLabel: 'Not Now',
      }
    : {
        emoji: '📤',
        title: 'Share This Listing?',
        subtitle:
          'NestUp would like to access your contacts or messaging apps to help you share this property with friends and family.',
        allowLabel: 'Yes, Share It',
        denyLabel: 'Maybe Later',
      };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>{content.emoji}</Text>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.subtitle}>{content.subtitle}</Text>

          <TouchableOpacity
            style={[styles.primaryButton, isLocation ? styles.locationButton : styles.contactsButton]}
            onPress={onAllow}
          >
            <Text style={[styles.primaryButtonText, !isLocation && styles.contactsButtonText]}>
              {content.allowLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onDeny}>
            <Text style={styles.secondaryButtonText}>{content.denyLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    minWidth: 96,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  secondary: {
    backgroundColor: '#f1f5f9',
  },
  primary: {
    backgroundColor: '#01696f',
  },
  secondaryText: {
    color: '#334155',
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  primaryButton: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  locationButton: {
    backgroundColor: TEAL,
  },
  contactsButton: {
    backgroundColor: GOLD,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  contactsButtonText: {
    color: '#222',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#888',
    fontSize: 15,
  },
});
