import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function PuzzleScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⏰</Text>
      <Text style={styles.title}>¡Resuelve el puzzle!</Text>
      <Text style={styles.subtitle}>No puedes apagar la alarma hasta responder correctamente.</Text>

      {/* Placeholder — aquí irá el puzzle real */}
      <View style={styles.card}>
        <Text style={styles.question}>¿Cuánto es 7 × 8?</Text>
      </View>

      {/* Botón temporal para probar que la navegación funciona */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.buttonText}>← Volver (temporal)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04040A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  question: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    padding: 14,
  },
  buttonText: {
    color: '#555',
    fontSize: 14,
  },
});