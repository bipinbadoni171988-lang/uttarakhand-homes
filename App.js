import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './src/navigation/TabNavigator';
import PhoneEntryScreen from './src/screens/PhoneEntryScreen';
import OtpScreen from './src/screens/OtpScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import SplashScreen from './src/components/SplashScreen';
import { COLORS } from './src/constants/theme';

const Stack = createStackNavigator();

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [profileChecked, setProfileChecked] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);

  // Wait for auth to resolve
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setAuthUser(user);
      setProfileChecked(false); // Reset profile check any time auth state changes
      setNeedsProfile(false);
    });
    return unsubscribe;
  }, []);

  // Check Firestore user profile only after authUser is available
  useEffect(() => {
    if (!authUser) {
      setProfileChecked(false);
      setNeedsProfile(false);
      return;
    }
    let cancelled = false;
    firestore()
      .collection('users')
      .doc(authUser.uid)
      .get()
      .then(snapshot => {
        if (cancelled) return;
        if (!snapshot.exists || !snapshot.data()?.name) {
          setNeedsProfile(true);
        }
        setProfileChecked(true);
      })
      .catch(() => {
        setProfileChecked(true);
        setNeedsProfile(false);
      });
    return () => { cancelled = true; };
  }, [authUser]);

  if (authUser === null || (authUser && !profileChecked)) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!authUser ? (
          <>
            <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
          </>
        ) : needsProfile ? (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : (
          <Stack.Screen name="App" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
