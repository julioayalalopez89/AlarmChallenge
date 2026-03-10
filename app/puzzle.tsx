import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform, Vibration,
} from 'react-native';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';

// Genera un acertijo matemático aleatorio
function generatePuzzle() {
  const a = Math.floor(Math.random() * 20) + 5;
  const b = Math.floor(Math.random() * 20) + 5;
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer: number;
  if (op === '+') answer = a + b;
  else if (op === '-') answer = a - b;
  else answer = a * b;
  return { question: `${a} ${op} ${b} = ?`, answer };
}

export default function PuzzleScreen() {
  const router = useRouter();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [puzzle] = useState(generatePuzzle);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);

  // Arranca el sonido en loop al montar
  useEffect(() => {
    let mounted = true;

    async function playAlarm() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/alarm.mp3'),
        { isLooping: true, shouldPlay: true, volume: 1.0 }
      );
      if (mounted) soundRef.current = sound;
    }

    playAlarm();

    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
    };
  }, []);

  const stopAlarmAndLeave = async () => {
    await soundRef.current?.stopAsync();
    await soundRef.current?.unloadAsync();
    router.replace('/');
  };

  const handleCheck = async () => {
    if (parseInt(input) === puzzle.answer) {
      setSolved(true);
      if (Platform.OS === 'android') Vibration.vibrate([0, 80, 80, 80]);
      await soundRef.current?.stopAsync();
      setTimeout(() => stopAlarmAndLeave(), 1000);
    } else {
      setError(true);
      if (Platform.OS === 'android') Vibration.vibrate(400);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.icon}>⏰</Text>
      <Text style={styles.title}>¡ALARMA!</Text>
      <Text style={styles.subtitle}>Resuelve el acertijo para apagar</Text>

      <View style={styles.card}>
        <Text style={styles.question}>{puzzle.question}</Text>
      </View>

      <TextInput
        style={[styles.input, error && styles.inputError, solved && styles.inputSolved]}
        value={input}
        onChangeText={setInput}
        keyboardType="numeric"
        placeholder="Tu respuesta"
        placeholderTextColor="rgba(240,237,232,0.3)"
        maxLength={6}
        editable={!solved}
        autoFocus
      />

      {solved ? (
        <Text style={styles.successText}>✅ ¡Correcto! Cerrando...</Text>
      ) : (
        <TouchableOpacity
          style={[styles.btn, error && styles.btnError]}
          onPress={handleCheck}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>
            {error ? '❌ Incorrecto, intenta de nuevo' : 'Verificar →'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#04040A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  icon: { fontSize: 64 },
  title: {
    color: '#FF6B35',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 6,
  },
  subtitle: {
    color: 'rgba(240,237,232,0.5)',
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,107,53,0.4)',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 48,
    backgroundColor: 'rgba(255,107,53,0.07)',
    marginVertical: 8,
  },
  question: {
    color: '#F0EDE8',
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -1,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: 'rgba(240,237,232,0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: '#F0EDE8',
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
    backgroundColor: 'rgba(240,237,232,0.05)',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: 'rgba(255,59,48,0.1)',
  },
  inputSolved: {
    borderColor: '#00D4AA',
    backgroundColor: 'rgba(0,212,170,0.1)',
  },
  btn: {
    width: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  btnError: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
  },
  btnText: {
    color: '#04040A',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  successText: {
    color: '#00D4AA',
    fontSize: 20,
    fontWeight: '700',
  },
});