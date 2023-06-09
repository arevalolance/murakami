import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "./src/screens/home"
import PlayerScreen from './src/screens/player';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
NativeModules.DevSettings.setIsDebuggingRemotely(true);
// AsyncStorage.clear()

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ title: "Recordings" }} component={HomeScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
