
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function CreateTeachers() {
  const [name, setName] = useState('');

  function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Campo obrigatório', 'Informe o nome do professor.');
      return;
    }

    // TODO: Salvar o professor no banco de dados.
    // Por enquanto, apenas valida o nome e retorna à listagem.

    router.replace('/admin/teachers');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar professor</Text>

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

        <Button title="Salvar professor" onPress={handleSave} />
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
