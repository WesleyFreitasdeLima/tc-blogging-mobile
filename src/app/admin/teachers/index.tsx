
import { router } from 'expo-router';
import { Pencil, Plus, Trash2, UserRound } from 'lucide-react-native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const teachers = [
  { id: '1', name: 'Mateus Silva' },
  { id: '2', name: 'José Santos' },
  { id: '3', name: 'Pedro Oliveira' },
];

export default function TeachersScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>GESTÃO ACADÊMICA</Text>
          <Text style={styles.title}>Professores</Text>
          <Text style={styles.description}>
            Acompanhe e gerencie os docentes da plataforma.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/admin/teachers/create')}
          style={styles.createButton}
        >
          <Plus size={19} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.createButtonText}>Novo professor</Text>
        </Pressable>
      </View>

      <View style={styles.listHeading}>
        <Text style={styles.listLabel}>EQUIPE DOCENTE</Text>
        <Text style={styles.count}>{teachers.length} cadastrados</Text>
      </View>

      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum professor cadastrado.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.teacherCard}>
            <View style={styles.teacherInfo}>
              <View style={styles.avatar}>
                <UserRound size={21} color="#4F46E5" strokeWidth={1.8} />
              </View>
              <View style={styles.nameBlock}>
                <Text style={styles.teacherName}>{item.name}</Text>
                <Text style={styles.teacherRole}>Professor</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Editar ${item.name}`}
                onPress={() =>
                  router.push(`/admin/teachers/${item.id}/edit`)
                }
                style={styles.editButton}
              >
                <Pencil size={15} color="#4F46E5" strokeWidth={2} />
                <Text style={styles.editButtonText}>Editar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Excluir ${item.name}`}
                onPress={() =>
                  router.push(`/admin/teachers/${item.id}/delete`)
                }
                style={styles.deleteButton}
              >
                <Trash2 size={15} color="#DC2626" strokeWidth={2} />
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </Pressable>
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
    paddingHorizontal: 22,
    paddingTop: 24,
    backgroundColor: '#F8FAFC',
  },
  header: {
    gap: 20,
  },
  headingCopy: {
    gap: 7,
  },
  eyebrow: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#172033',
  },
  description: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
  },
  createButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 10,
  },
  listLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  count: {
    color: '#64748B',
    fontSize: 12,
  },
  list: {
    paddingBottom: 20,
    gap: 10,
  },
  teacherCard: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 15,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#EEF2FF',
  },
  nameBlock: {
    flex: 1,
    gap: 3,
  },
  teacherName: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '700',
  },
  teacherRole: {
    color: '#94A3B8',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 9,
  },
  editButton: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  editButtonText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  empty: {
    color: '#64748B',
    textAlign: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
});
