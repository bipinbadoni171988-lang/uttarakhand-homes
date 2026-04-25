import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import PropertyScreen from '../screens/PropertyScreen';
import RentalsScreen from '../screens/RentalsScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TEAL } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon }) => <Text style={{ fontSize: 22 }}>{icon}</Text>;

const ProfileWrapper = ({ user, userData, role, onLogout }) => (
  <ProfileScreen user={user} userData={userData} role={role} onLogout={onLogout} />
);

export const TabNavigator = ({ user, userData, role, onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TEAL,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: 'white',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopColor: '#eee',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: () => <TabIcon icon="🏡" /> }}
      />
      <Tab.Screen
        name="Properties"
        component={PropertyScreen}
        options={{ tabBarIcon: () => <TabIcon icon="🏠" /> }}
      />
      <Tab.Screen
        name="Rentals"
        component={RentalsScreen}
        options={{ tabBarIcon: () => <TabIcon icon="📦" /> }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{ tabBarIcon: () => <TabIcon icon="🔧" /> }}
      />
      <Tab.Screen
        name="Profile"
        options={{ tabBarIcon: () => <TabIcon icon="👤" /> }}
      >
        {() => (
          <ProfileWrapper
            user={user}
            userData={userData}
            role={role}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
// TODO: implement
