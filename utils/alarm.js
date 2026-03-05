import * as Notifications from 'expo-notifications';

export async function scheduleAlarm(hour, minute) {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Se necesitan permisos para las alarmas');
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ ¡Alarma!",
      body: "Resuelve el puzzle para apagar",
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,  // ← esto faltaba
      hour,
      minute,
    },
  });
}

export async function getAlarmas() {
  const alarmas = await Notifications.getAllScheduledNotificationsAsync();
  console.log('Alarmas programadas:', JSON.stringify(alarmas, null, 2));
}