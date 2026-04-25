import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CategoryBanner = ({
  emoji,
  title,
  subtitle,
  ctaText,
  gradientFrom,
  gradientTo,
  onPress,
}) => {
  const backgroundColor = gradientFrom || gradientTo || '#1F7A8C';

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.touchable}>
      <View style={[styles.card, { backgroundColor }]}>
        <View style={styles.emojiCircle}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </View>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <Text numberOfLines={2} style={styles.subtitle}>
          {subtitle}
        </Text>

        <View style={styles.ctaButton}>
          <Text style={[styles.ctaText, { color: backgroundColor }]}>{ctaText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 28,
  },
  title: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  ctaButton: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '800',
  },
});

export default CategoryBanner;
// TODO: implement
