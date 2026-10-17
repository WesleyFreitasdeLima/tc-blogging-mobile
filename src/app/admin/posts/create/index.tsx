import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import { AlignLeft, ArrowLeft, Check, FileText } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { postsService } from '@/shared/services/posts.service';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      Alert.alert('Campo obrigatório', 'Informe o título da publicação.');
      return;
    }

    if (!trimmedContent) {
      Alert.alert('Campo obrigatório', 'Informe o conteúdo da publicação.');
      return;
    }

    try {
      setSaving(true);
      await postsService.create({
        title: trimmedTitle,
        content: trimmedContent,
      });

      router.replace('/admin/posts');
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(
          'Erro ao salvar',
          error.response?.data?.message || 'Não foi possível criar a publicação.',
        );
      } else if (error instanceof Error) {
        Alert.alert('Erro ao salvar', error.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado ao salvar.');
      }
    } finally {
      setSaving(false);
    }
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
        accessibilityLabel="Voltar para publicações"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ArrowLeft size={18} color="#4F46E5" />
        <Text style={styles.backText}>Publicações</Text>
      </Pressable>

      <View style={styles.heading}>
        <Text style={styles.title}>Criar publicação</Text>
        <Text style={styles.description}>
          Preencha os campos para publicar um novo artigo no blog.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldBlock}>
          <View style={styles.fieldHeader}>
            <View style={styles.fieldIcon}>
              <FileText size={18} color="#4F46E5" />
            </View>
            <View style={styles.fieldCopy}>
              <Text style={styles.label}>Título</Text>
              <Text style={styles.fieldHint}>Título visível aos leitores</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Um título que desperte curiosidade"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
            autoCorrect={false}
          />
        </View>

        <View style={styles.fieldBlock}>
          <View style={styles.fieldHeader}>
            <View style={styles.fieldIcon}>
              <AlignLeft size={18} color="#4F46E5" />
            </View>
            <View style={styles.fieldCopy}>
              <Text style={styles.label}>Conteúdo</Text>
              <Text style={styles.fieldHint}>Texto completo do artigo</Text>
            </View>
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escreva aqui o conteúdo da publicação..."
            placeholderTextColor="#94A3B8"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveButton, saving && styles.buttonDisabled]}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.saveButtonText}>Publicar post</Text>
            </>
          )}
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
    gap: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
  },
  fieldBlock: {
    gap: 10,
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
  textArea: {
    minHeight: 130,
    paddingTop: 12,
    paddingBottom: 12,
  },
  saveButton: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 11,
    backgroundColor: '#4F46E5',
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
