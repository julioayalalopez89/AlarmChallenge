import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import * as Notifications from 'expo-notifications';
// ← Agrega esto ANTES del componente, fuera de todo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,  // ← nuevo
    shouldShowList: true,    // ← nuevo
  }),
});

import { Platform } from 'react-native';
// Después del setNotificationHandler
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('alarm', {
  name: 'Alarmas',
  importance: Notifications.AndroidImportance.MAX,
  sound: 'alarm.mp3', // ← nombre del archivo
  vibrationPattern: [0, 250, 250, 250],
  enableVibrate: true,
});
}


export const unstable_settings = {
  anchor: '(tabs)',
};


export default function RootLayout() {

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
