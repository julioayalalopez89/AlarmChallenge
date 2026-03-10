import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>AlarmChallenge</Text>
      <Text style={styles.subtitle}>Despierta de verdad.</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push('./add-alarm')}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>+ Nueva Alarma</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#04040A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    color: '#F0EDE8',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    color: 'rgba(240,237,232,0.35)',
    fontSize: 15,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    elevation: 12,
  },
  btnText: {
    color: '#04040A',
    fontSize: 17,
    fontWeight: '700',
  },
});