import { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState<any[]>([]);

  const loadAlarms = async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    setAlarms(scheduled);
  };

  const deleteAlarm = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    loadAlarms(); // refresca la lista
  };

  const deleteAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    loadAlarms();
  };

  const addTestAlarm = async () => {
    // Alarma en 10 segundos para probar rápido
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ ¡Alarma!',
        body: 'Resuelve el puzzle para apagar',
        sound: 'default',
      },
      trigger: {
         type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 10,
    repeats: true,
    channelId: 'alarm', // ← agrega esto
      },
    });
    loadAlarms();
  };

  useEffect(() => {
    loadAlarms();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarmas programadas ({alarms.length})</Text>

      <Button title="+ Probar (suena en 10 seg)" onPress={addTestAlarm} />
      <Button title="🗑️ Borrar todas" onPress={deleteAll} color="red" />

      <FlatList
        data={alarms}
        keyExtractor={(item) => item.identifier}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.content.title}</Text>
            <Text>Trigger: {JSON.stringify(item.trigger)}</Text>
            <Button
              title="Eliminar"
              onPress={() => deleteAlarm(item.identifier)}
              color="red"
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay alarmas</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    gap: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});