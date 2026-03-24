import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';

const CHANNEL_ID = 'alarm-challenge';

// Crea el canal la primera vez (safe llamarlo siempre)
export async function setupNotificationChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Alarmas',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'alarm',          // Android busca alarm.mp3 en res/raw
    vibration: true,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function scheduleAlarm(hour: number, minute: number) {
  await setupNotificationChannel();

  // Construye el timestamp para la próxima ocurrencia de esa hora
  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hour, minute, 0, 0);
  if (trigger <= now) {
    trigger.setDate(trigger.getDate() + 1); // Si ya pasó hoy, programa para mañana
  }

  await notifee.createTriggerNotification(
    {
      title: '⏰ ¡Alarma!',
      body: 'Resuelve el puzzle para apagar',
      android: {
        channelId: CHANNEL_ID,
        sound: 'alarm',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        fullScreenAction: {
          id: 'default',         // Abre la app en foreground
          launchActivity: 'default',
        },
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: trigger.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    }
  );
}

// Para pruebas: dispara en N segundos
export async function scheduleTestAlarm(seconds = 10) {
  await setupNotificationChannel();

  await notifee.createTriggerNotification(
    {
      title: '⏰ ¡Alarma de prueba!',
      body: 'Resuelve el puzzle para apagar',
      android: {
        channelId: CHANNEL_ID,
        sound: 'alarm',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        fullScreenAction: {
          id: 'default',
          launchActivity: 'default',
        },
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + seconds * 1000,
    }
  );
}

export async function getAlarmas() {
  return await notifee.getTriggerNotifications();
}

export async function cancelAlarm(notificationId: string) {
  await notifee.cancelTriggerNotification(notificationId);
}

export async function cancelAllAlarms() {
  await notifee.cancelAllNotifications();
}