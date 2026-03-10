import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('alarm', {
    name: 'Alarmas',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'alarm.mp3',
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
  });
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // ← CLAVE: guardamos la señal de navegar en un state,
  // no llamamos router.push() directamente desde el listener
  const [navigateToPuzzle, setNavigateToPuzzle] = useState(false);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // ── Efecto 1: registrar los listeners ──────────────────────────────────────
  useEffect(() => {
    // App en FOREGROUND — alarma llega sin que el usuario toque
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      console.log('🔔 Alarma en foreground');
      setNavigateToPuzzle(true);
    });

    // App en BACKGROUND — usuario toca la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      console.log('👆 Usuario tocó la notificación');
      setNavigateToPuzzle(true);
    });

    // App CERRADA — se abrió desde la notificación (cold start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        console.log('🚀 Cold start desde notificación');
        setNavigateToPuzzle(true);
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // ── Efecto 2: navegar cuando el router YA esté listo ──────────────────────
  useEffect(() => {
    if (navigateToPuzzle) {
      router.push('/puzzle');
      setNavigateToPuzzle(false);
    }
  }, [navigateToPuzzle]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="alarms" options={{ title: 'Alarmas' }} />
        <Stack.Screen name="puzzle" options={{ headerShown: false }} />
        <Stack.Screen name="add-alarm" options={{ title: 'Nueva alarma' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}