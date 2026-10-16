
import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';

const teachers = [
  { id: '1', name: 'Mateus Silva' },
  { id: '2', name: 'José Santos' },
  { id: '3', name: 'Pedro Oliveira' },
];

export default function EditTeacher() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const teacher = teachers.find((teacher) => teacher.id === id);

  const [name, setName] = useState(teacher?.name ?? '');

  function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Campo obrigatório', 'Informe o nome do professor.');
      return;
    }

    if (!teacher) {
      Alert.alert('Erro', 'Professor não encontrado.');
      return;
    }

    // TODO: Atualizar o professor no banco de dados.

    router.replace('/admin/teachers');
  }

  if (!teacher) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Professor não encontrado</Text>
        <Button
          title="Voltar"
          onPress={() => router.replace('/admin/teachers')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar professor</Text>

      <Text style={styles.description}>
        Editando: {teacher.name}
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome do professor</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o nome do professor"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <Button
          title="Salvar alterações"
          onPress={handleSave}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#172033',
  },
  description: {
    color: '#64748B',
    fontSize: 16,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172033',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
});
