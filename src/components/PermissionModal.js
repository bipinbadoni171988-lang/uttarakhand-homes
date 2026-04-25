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
  },
});
