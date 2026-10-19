import { isAxiosError } from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { AlignLeft, ArrowLeft, Check, FileText } from 'lucide-react-native';
import { useEffect, useState } from 'react';
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

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await postsService.getById(id);
        if (data) {
          setTitle(data.title ?? '');
          setContent(data.content ?? '');
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao buscar post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

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

    if (!id) return;

    try {
      setSaving(true);
      await postsService.update(id, {
        title: trimmedTitle,
        content: trimmedContent,
      });

      router.replace('/admin/posts');
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(
          'Erro ao salvar',
          error.response?.data?.message || 'Não foi possível atualizar a publicação.',
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

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={[styles.screen, styles.center, { padding: 24, gap: 16 }]}>
        <View style={styles.notFoundIcon}>
          <FileText size={25} color="#64748B" />
        </View>
        <Text style={styles.title}>Publicação não encontrada</Text>
        <Text style={styles.description}>
          Esse post pode ter sido removido ou não está acessível.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/admin/posts')}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Voltar para publicações</Text>
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
        accessibilityLabel="Voltar para publicações"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ArrowLeft size={18} color="#4F46E5" />
        <Text style={styles.backText}>Publicações</Text>
      </Pressable>

      <View style={styles.heading}>
        <Text style={styles.title}>Editar publicação</Text>
        <Text style={styles.description}>
          Faça alterações da postagem aqui. Clique em salvar alterações quando terminar.
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
              <Text style={styles.fieldHint}>Revise o título do artigo</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Título da publicação"
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
            placeholder="Conteúdo da publicação..."
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
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
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
