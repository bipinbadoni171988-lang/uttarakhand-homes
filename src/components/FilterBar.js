import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function InlineFilterIcon() {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.barRow, { width: 24 }]}>
        <View style={styles.handle} />
      </View>
      <View style={[styles.barRow, { width: 18, marginLeft: 3 }]}>
        <View style={[styles.handle, { left: 10 }]} />
      </View>
      <View style={[styles.barRow, { width: 12, marginLeft: 6 }]}>
        <View style={[styles.handle, { left: 4 }]} />
      </View>
    </View>
  );
}

export default function FilterBar({ onPress, label = 'Filters' }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <InlineFilterIcon />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#b9e1df',
    backgroundColor: '#ecf9f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    marginLeft: 8,
    color: '#01696f',
    fontWeight: '600',
    fontSize: 13,
  },
  iconWrap: {
    height: 16,
    justifyContent: 'space-between',
  },
  barRow: {
    height: 2,
    backgroundColor: '#01696f',
    borderRadius: 999,
    position: 'relative',
  },
  handle: {
    position: 'absolute',
    top: -3,
    left: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#01696f',
  },
});
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { TEAL, BG, GOLD } from '../constants/theme';

const PLACEHOLDERS = {
  property: 'Search properties...',
  rental: 'Search rentals...',
  service: 'Search services...',
};

const SliderIcon = () => (
  <View style={styles.sliderIconWrap}>
    <View style={styles.sliderTrackRow}>
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderDot, styles.sliderDotTop]} />
    </View>
    <View style={styles.sliderTrackRow}>
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderDot, styles.sliderDotMiddle]} />
    </View>
    <View style={styles.sliderTrackRow}>
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderDot, styles.sliderDotBottom]} />
    </View>
  </View>
);

const FilterChip = ({ label, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, isSelected && styles.chipSelected]}
    activeOpacity={0.85}
  >
    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

export const FilterBar = ({
  regions = [],
  selectedRegion,
  onRegionChange,
  types = [],
  selectedType,
  onTypeChange,
  onLocationPress,
  isOpen,
  onToggle,
  activeCount = 0,
  screenType = 'property',
}) => {
  const [searchText, setSearchText] = useState('');

  const placeholder = PLACEHOLDERS[screenType] || 'Search...';

  const activeFilters = useMemo(() => {
    const items = [];

    if (selectedRegion) {
      items.push({
        key: 'region',
        label: selectedRegion,
        onRemove: () => onRegionChange?.(''),
      });
    }

    if (selectedType) {
      items.push({
        key: 'type',
        label: String(selectedType),
        onRemove: () => onTypeChange?.(''),
      });
    }

    return items;
  }, [selectedRegion, selectedType, onRegionChange, onTypeChange]);

  const showCollapsedPills = !isOpen && activeCount > 0 && activeFilters.length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#8FA3A3"
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={onToggle}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Toggle filters"
        >
          <SliderIcon />
          {activeCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {isOpen ? (
        <View style={styles.panel}>
          <Text style={styles.sectionLabel}>📍 REGION</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowChips}
          >
            {regions.map((region) => {
              const label = region?.label ?? '';
              const icon = region?.icon ?? '';
              const display = `${icon ? `${icon} ` : ''}${label}`.trim();

              return (
                <FilterChip
                  key={label || display}
                  label={display}
                  isSelected={selectedRegion === label}
                  onPress={() => onRegionChange?.(label)}
                />
              );
            })}
          </ScrollView>

          <Text style={styles.sectionLabel}>TYPE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowChips}
          >
            {types.map((typeItem) => {
              const typeValue = String(typeItem);

              return (
                <FilterChip
                  key={typeValue}
                  label={typeValue}
                  isSelected={String(selectedType) === typeValue}
                  onPress={() => onTypeChange?.(typeItem)}
                />
              );
            })}
          </ScrollView>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton, styles.buttonSpacingRight]}
              onPress={() => {
                onRegionChange?.('');
                onTypeChange?.('');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.clearText}>✕ Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.applyButton]}
              onPress={onToggle}
              activeOpacity={0.85}
            >
              <Text style={styles.applyText}>Apply ✓</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.locationRow} onPress={onLocationPress} activeOpacity={0.85}>
            <Text style={styles.locationText}>📍 Detect my location automatically →</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {showCollapsedPills ? (
        <View style={styles.activePillsRow}>
          {activeFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={styles.activePill}
              onPress={filter.onRemove}
              activeOpacity={0.85}
            >
              <Text style={styles.activePillText}>{filter.label} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#D6E2E2',
    color: '#1F2D2D',
  },
  filterButton: {
    marginLeft: 10,
    height: 44,
    minWidth: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2E2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    paddingHorizontal: 12,
  },
  sliderIconWrap: {
    width: 18,
    height: 16,
    justifyContent: 'space-between',
  },
  sliderTrackRow: {
    width: 18,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 2,
    width: 18,
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  sliderDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEAL,
    top: -2,
  },
  sliderDotTop: {
    left: 2,
  },
  sliderDotMiddle: {
    left: 9,
  },
  sliderDotBottom: {
    left: 5,
  },
  badge: {
    position: 'absolute',
    top: -7,
    right: -7,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#1F2D2D',
    fontSize: 11,
    fontWeight: '700',
  },
  panel: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE7E7',
    padding: 12,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#809292',
    marginBottom: 8,
    fontWeight: '600',
  },
  rowChips: {
    paddingBottom: 10,
    paddingRight: 8,
  },
  chip: {
    backgroundColor: '#F2F7F7',
    borderColor: '#CFE0E0',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#E2F4F4',
    borderColor: TEAL,
  },
  chipText: {
    color: '#315151',
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: TEAL,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSpacingRight: {
    marginRight: 10,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#C6D6D6',
    backgroundColor: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: TEAL,
  },
  clearText: {
    color: '#466161',
    fontWeight: '600',
  },
  applyText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  locationRow: {
    marginTop: 12,
    paddingVertical: 4,
  },
  locationText: {
    color: TEAL,
    fontWeight: '600',
  },
  activePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  activePill: {
    backgroundColor: '#E5F4F4',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#B7DCDC',
    marginRight: 8,
    marginBottom: 8,
  },
  activePillText: {
    color: TEAL,
    fontWeight: '600',
    fontSize: 12,
  },
});

export default FilterBar;
