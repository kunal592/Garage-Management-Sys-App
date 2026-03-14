import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  CustomerList: undefined;
  CustomerDetail: { customerId: string };
  AddService: { customerId?: string };
  Analytics: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{
            title: 'Customer Directory',
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{
            title: 'Profile',
        }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{
            title: 'New Service Record',
        }}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
            title: 'Insights',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
