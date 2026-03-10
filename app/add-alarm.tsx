import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Vibration,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter } from 'expo-router';
import { scheduleAlarm } from '../utils/alarm';

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function AddAlarmScreen() {
  const router = useRouter();

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const hasTime = selectedHour !== null && selectedMinute !== null;

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    setSelectedHour(date.getHours());
    setSelectedMinute(date.getMinutes());
    setSaved(false);
  };

  const handleSave = async () => {
    if (!hasTime) return;
    await scheduleAlarm(selectedHour!, selectedMinute!);
    if (Platform.OS === 'android') Vibration.vibrate([0, 50, 80, 50]);
    setSaved(true);
    setTimeout(() => router.back(), 800);
  };

  const formatTime = () => {
    if (!hasTime) return '--:--';
    const h = selectedHour! % 12 || 12;
    const ampm = selectedHour! < 12 ? 'AM' : 'PM';
    return `${pad(h)}:${pad(selectedMinute!)} ${ampm}`;
  };

  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Alarma</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.label}>HORA SELECCIONADA</Text>

        <Text style={[styles.timeText, !hasTime && styles.timeTextEmpty]}>
          {formatTime()}
        </Text>

        {/* Open picker */}
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.selectBtnText}>
            {hasTime ? '✏️  Cambiar hora' : '🕐  Seleccionar hora'}
          </Text>
        </TouchableOpacity>

        {/* Save — only shows after picking a time */}
        {hasTime && (
          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.saveBtnDone]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>
              {saved ? '✅  Alarma guardada' : '⏰  Guardar Alarma'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Native time picker modal */}
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        is24Hour={false}
        display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#04040A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 56,
    paddingBottom: 16,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  backIcon: { color: '#FF6B35', fontSize: 24 },
  headerTitle: {
    color: '#F0EDE8',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  label: {
    color: 'rgba(240,237,232,0.3)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
  },
  timeText: {
    fontSize: 80,
    fontWeight: '200',
    color: '#F0EDE8',
    letterSpacing: -2,
  },
  timeTextEmpty: {
    color: 'rgba(240,237,232,0.15)',
  },
  selectBtn: {
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  selectBtnText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  saveBtn: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  saveBtnDone: {
    backgroundColor: '#00D4AA',
    shadowColor: '#00D4AA',
  },
  saveBtnText: {
    color: '#04040A',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});