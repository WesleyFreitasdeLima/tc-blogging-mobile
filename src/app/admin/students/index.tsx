import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';

export default function StudentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos</Text>
      <Text style={styles.description}>
        Aqui ficará o gerenciamento de alunos.
      </Text>

      <Button
        title="Criar aluno"
        onPress={() => router.push('/admin/students/create')}
      />

      <Button
        title="Editar aluno"
        onPress={() => router.push('/admin/students/1/edit')}
      />

      <Button
        title="Excluir aluno"
        onPress={() => router.push('/admin/students/1/delete')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  title: { fontSize: 28, fontWeight: '800', color: '#172033' },
  description: { color: '#64748B', marginTop: 12, lineHeight: 22 },
});
