import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

export const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const rawIndex = Math.round(offsetX / WINDOW_WIDTH);
    const boundedIndex = Math.max(0, Math.min(rawIndex, images.length - 1));
    setCurrentIndex(boundedIndex);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {images.map((uri, index) => (
          <Image key={`${uri}-${index}`} source={{ uri }} style={styles.image} resizeMode="cover" />
        ))}
      </ScrollView>

      <View style={styles.counterBadge}>
        <Text style={styles.counterText}>{`${currentIndex + 1} / ${images.length}`}</Text>
      </View>

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              index !== images.length - 1 && styles.dotSpacing,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: 270,
    position: 'relative',
  },
  image: {
    width: WINDOW_WIDTH,
    height: 270,
  },
  counterBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dotSpacing: {
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
  },
});
