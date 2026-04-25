import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from './TabNavigator';
import WelcomeScreen from '../../App';

export const AppNavigator = ({ user, userData, role, onLogin, onLogout }) => {
  return (
    <NavigationContainer>
      {!user && role !== 'guest' ? (
        <WelcomeScreen onLogin={onLogin} />
      ) : (
        <TabNavigator
          user={user}
          userData={userData}
          role={role}
          onLogout={onLogout}
        />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
