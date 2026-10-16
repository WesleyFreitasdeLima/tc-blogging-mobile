
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { router } from 'expo-router';

const teachers = [
  { id: '1', name: 'Mateus Silva' },
  { id: '2', name: 'José Santos' },
  { id: '3', name: 'Pedro Oliveira' },
];

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

      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum professor cadastrado.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.teacherCard}>
            <Text style={styles.teacherName}>{item.name}</Text>

            <View style={styles.actions}>
              <View style={styles.button}>
                <Button
                  title="Editar"
                  onPress={() =>
                    router.push(`/admin/teachers/${item.id}/edit`)
                  }
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="Excluir"
                  color="#DC2626"
                  onPress={() =>
                    router.push(`/admin/teachers/${item.id}/delete`)
                  }
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#172033',
  },
  description: {
    color: '#64748B',
    marginTop: 12,
    marginBottom: 20,
    lineHeight: 22,
  },
  list: {
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  teacherCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teacherName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#172033',
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  empty: {
    color: '#64748B',
    textAlign: 'center',
    padding: 24,
  },
});
