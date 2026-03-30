import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import './src/config/i18n';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import CenterDetailsScreen from './src/screens/CenterDetailsScreen';
import ThankYouScreen from './src/screens/ThankYouScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProviderSetupScreen from './src/screens/ProviderSetupScreen';
import LocationCaptureScreen from './src/screens/LocationCaptureScreen';
import ProviderDashboardScreen from './src/screens/ProviderDashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          {/* Splash */}
          <Stack.Screen name="Splash" component={SplashScreen} />

          {/* Patient Flow (مستغيث) */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="CenterDetails" component={CenterDetailsScreen} />
          <Stack.Screen name="ThankYou" component={ThankYouScreen} />

          {/* Provider Flow (مغيث) */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ProviderSetup" component={ProviderSetupScreen} />
          <Stack.Screen name="LocationCapture" component={LocationCaptureScreen} />
          <Stack.Screen name="ProviderDashboard" component={ProviderDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
