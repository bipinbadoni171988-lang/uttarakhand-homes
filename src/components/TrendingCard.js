import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const getServiceEmoji = (category) => {
  const value = String(category || '').toLowerCase();

  if (value.includes('clean')) {
    return '🧹';
  }

  if (value.includes('electric') || value.includes('light')) {
    return '💡';
  }

  return '🔧';
};

const normalizeImageSource = (imagesOrIcon) => {
  if (!imagesOrIcon) {
    return null;
  }

  if (Array.isArray(imagesOrIcon)) {
    const [first] = imagesOrIcon;
    if (!first) {
      return null;
    }

    if (typeof first === 'string') {
      return { uri: first };
    }

    if (first?.uri) {
      return { uri: first.uri };
    }

    return first;
  }

  if (typeof imagesOrIcon === 'string') {
    return { uri: imagesOrIcon };
  }

  if (imagesOrIcon?.uri) {
    return { uri: imagesOrIcon.uri };
  }

  return imagesOrIcon;
};

export const TrendingCard = ({ item, onPress, variant }) => {
  const title = item?.title || '';
  const location = item?.district || item?.area || '';
  const amount = item?.price || item?.charge || '';
  const category = item?.type || item?.category || '';
  const imageSource = normalizeImageSource(item?.images || item?.icon);
  const isService = variant === 'service';

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      {isService ? (
        <View style={styles.serviceContent}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{getServiceEmoji(category)}</Text>
          </View>

          <Text numberOfLines={1} style={styles.serviceName}>
            {title}
          </Text>

          <Text numberOfLines={1} style={styles.serviceCategory}>
            {category}
          </Text>

          <Text numberOfLines={1} style={styles.serviceCharge}>
            {amount}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.imageWrap}>
            {imageSource ? (
              <Image source={imageSource} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imageFallback]} />
            )}

            <View style={styles.priceOverlay}>
              <Text numberOfLines={1} style={styles.priceText}>
                {amount}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>

            <Text numberOfLines={1} style={styles.location}>
              {location}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrap: {
    width: 160,
    height: 110,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    backgroundColor: '#E4E7EC',
  },
  priceOverlay: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 10,
    paddingTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  location: {
    marginTop: 4,
    fontSize: 12,
    color: '#667085',
  },
  serviceContent: {
    padding: 12,
    minHeight: 170,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DFF8F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  serviceCategory: {
    marginTop: 4,
    fontSize: 12,
    color: '#0AAE9F',
    fontWeight: '600',
  },
  serviceCharge: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#344054',
  },
});

export default TrendingCard;
