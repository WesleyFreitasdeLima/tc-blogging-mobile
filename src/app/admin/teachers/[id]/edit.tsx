
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
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
        <View style={styles.notFoundIcon}>
          <UserRound size={25} color="#64748B" />
        </View>
        <Text style={styles.title}>Professor não encontrado</Text>
        <Text style={styles.description}>
          Esse cadastro pode ter sido removido ou não está disponível.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/admin/teachers')}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Voltar para professores</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar para professores"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ArrowLeft size={18} color="#4F46E5" />
        <Text style={styles.backText}>Professores</Text>
      </Pressable>

      <View style={styles.heading}>
        <Text style={styles.eyebrow}>ATUALIZAR CADASTRO</Text>
        <Text style={styles.title}>Editar professor</Text>
        <Text style={styles.description}>
          Altere as informações de {teacher.name}.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldHeader}>
          <View style={styles.fieldIcon}>
            <UserRound size={18} color="#4F46E5" />
          </View>
          <View style={styles.fieldCopy}>
            <Text style={styles.label}>Nome completo</Text>
            <Text style={styles.fieldHint}>Revise o nome do docente</Text>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nome do professor"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.saveButtonText}>Salvar alterações</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 26,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  backText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
  heading: {
    gap: 8,
  },
  eyebrow: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: '#172033',
    fontSize: 29,
    fontWeight: '800',
  },
  description: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
  },
  form: {
    padding: 18,
    gap: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  fieldIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  fieldCopy: {
    gap: 3,
  },
  label: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '600',
  },
  fieldHint: {
    color: '#94A3B8',
    fontSize: 12,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    color: '#172033',
    fontSize: 16,
  },
  saveButton: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 11,
    backgroundColor: '#4F46E5',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  notFoundIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
  },
});
