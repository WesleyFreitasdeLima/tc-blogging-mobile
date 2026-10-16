
import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';

export default function DeleteTeacher() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professor removido!</Text>

      <Text style={styles.description}>
        O professor foi removido com sucesso.
      </Text>

      <Button
        title="Voltar para a listagem"
        onPress={() => router.replace('/admin/teachers')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#172033',
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 22,
  },
});
