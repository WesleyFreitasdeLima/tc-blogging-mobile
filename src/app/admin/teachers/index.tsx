import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';

export default function TeachersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professores</Text>
      <Text style={styles.description}>
        Aqui ficará o gerenciamento de professores.
      </Text>

      <Button
        title="Criar professor"
        onPress={() => router.push('/admin/teachers/create')}
      />

      <Button
        title="Editar professor"
        onPress={() => router.push('/admin/teachers/1/edit')}
      />

      <Button
        title="Excluir professor"
        onPress={() => router.push('/admin/teachers/1/delete')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  title: { fontSize: 28, fontWeight: '800', color: '#172033' },
  description: { color: '#64748B', marginTop: 12, lineHeight: 22 },
});
