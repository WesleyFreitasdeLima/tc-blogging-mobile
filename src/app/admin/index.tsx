
import { View, Text, StyleSheet } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.description}>
        Bem-vindo ao painel administrativo do TC Blogging.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  title: { fontSize: 28, fontWeight: '800', color: '#172033' },
  description: { color: '#64748B', marginTop: 12, lineHeight: 22 },
});
