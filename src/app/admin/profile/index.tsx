
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nome completo</Text>
      <Text style={styles.description}>
        Meu perfil
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  title: { fontSize: 28, fontWeight: '800', color: '#172033' },
  description: { color: '#64748B', marginTop: 12, lineHeight: 22 },
});
