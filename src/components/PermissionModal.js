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
