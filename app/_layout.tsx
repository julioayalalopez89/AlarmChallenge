import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Muestra la notificación aunque la app esté abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Canal de Android con tu alarm.mp3
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('alarm', {
    name: 'Alarmas',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'alarm.mp3',
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
  });
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Cuando la app está abierta y llega la alarma
    const subReceived = Notifications.addNotificationReceivedListener(() => {
      router.push('/puzzle');
    });

    // Cuando el usuario toca la notificación desde fuera de la app
    const subResponse = Notifications.addNotificationResponseReceivedListener(() => {
      router.push('/puzzle');
    });

    return () => {
      subReceived.remove();
      subResponse.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="puzzle"
        options={{
          presentation: 'fullScreenModal', // cubre todo, sin tab bar
          gestureEnabled: false,           // no se puede deslizar para cerrar
        }}
      />
    </Stack>
  );
}