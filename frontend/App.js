/**
 * App.js - Main Entry Point
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator from './src/navigation/RootNavigator';
import useQueueStore from './src/store/queueStore';

export default function App() {
  const { loadUserData } = useQueueStore();

  useEffect(() => {
    // Load user data from storage on app start
    loadUserData();
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
