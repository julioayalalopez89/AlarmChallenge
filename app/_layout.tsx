import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import notifee, { EventType } from '@notifee/react-native';
import { setupNotificationChannel } from '../utils/alarm';

// ① Handler para cuando la app está CERRADA o en background
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS || type === EventType.DELIVERED) {
    // La navegación ocurre automáticamente vía fullScreenAction
    // Aquí puedes limpiar la notificación
    if (detail.notification?.id) {
      await notifee.cancelNotification(detail.notification.id);
    }
  }
});

// ② Componente que maneja navegación cuando la app está EN FOREGROUND
function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    setupNotificationChannel();

    // Listener para cuando la app está abierta
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.DELIVERED || type === EventType.PRESS) {
        if (detail.notification?.id) {
          notifee.cancelNotification(detail.notification.id);
        }
        router.push('/puzzle');
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'AlarmChallenge' }} />
      <Stack.Screen name="alarms" options={{ title: 'Mis Alarmas' }} />
      <Stack.Screen name="puzzle" options={{ 
        title: 'Resuelve el Puzzle',
        headerBackVisible: false,   // No puede volver atrás sin resolver
      }} />
      <NotificationHandler />
    </Stack>
  );
}