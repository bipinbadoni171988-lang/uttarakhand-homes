import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import PropertyScreen from './src/screens/PropertyScreen';
import RentalsScreen from './src/screens/RentalsScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SeedDataScreen from './src/screens/SeedDataScreen';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Properties') iconName = focused ? 'business' : 'business-outline';
          else if (route.name === 'Rentals') iconName = focused ? 'car' : 'car-outline';
          else if (route.name === 'Services') iconName = focused ? 'construct' : 'construct-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#01696f',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 60,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Properties" component={PropertyScreen} />
      <Tab.Screen name="Rentals" component={RentalsScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSeed, setShowSeed] = useState(false);

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <MainTabs />

        {/* Dev Seed Button */}
        <TouchableOpacity
          style={styles.seedBtn}
          onPress={() => setShowSeed(true)}
        >
          <Text style={{ fontSize: 24 }}>🌱</Text>
        </TouchableOpacity>

        {/* Seed Modal */}
        <Modal visible={showSeed} animationType="slide">
          <SeedDataScreen />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowSeed(false)}
          >
            <Text style={styles.closeTxt}>✕ Close</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  seedBtn: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  closeBtn: {
    backgroundColor: '#01696f',
    padding: 16,
    alignItems: 'center',
  },
  closeTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});