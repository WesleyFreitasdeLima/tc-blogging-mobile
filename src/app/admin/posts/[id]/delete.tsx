import { isAxiosError } from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, FileText, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { postsService } from '@/shared/services/posts.service';
import type { Post } from '@/shared/types/post';

export default function DeletePostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await postsService.getById(id);
        setPost(data);
      } catch (error) {
        console.error('Erro ao carregar post para exclusão:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  async function handleConfirmDelete() {
    if (!id) return;

    try {
      setDeleting(true);
      await postsService.delete(id);
      setDeleted(true);
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(
          'Erro ao excluir',
          error.response?.data?.message || 'Não foi possível excluir a publicação.',
        );
      } else if (error instanceof Error) {
        Alert.alert('Erro ao excluir', error.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado ao excluir.');
      }
    } finally {
      setDeleting(false);
    }
  }

  if (deleted) {
    return (
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar para publicações"
          onPress={() => router.replace('/admin/posts')}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color="#4F46E5" />
          <Text style={styles.backText}>Publicações</Text>
        </Pressable>

        <View style={styles.result}>
          <View style={styles.successIcon}>
            <Check size={27} color="#4F46E5" strokeWidth={2.5} />
          </View>

          <Text style={styles.eyebrow}>AÇÃO CONCLUÍDA</Text>
          <Text style={styles.title}>Publicação removida</Text>
          <Text style={styles.description}>
            O post foi excluído com sucesso do sistema.
          </Text>

          <View style={styles.notice}>
            <FileText size={17} color="#4F46E5" />
            <Text style={styles.noticeText}>
              A listagem de postagens foi atualizada.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/admin/posts')}
            style={styles.returnButton}
          >
            <Text style={styles.returnButtonText}>Voltar para a listagem</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar para publicações"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ArrowLeft size={18} color="#4F46E5" />
        <Text style={styles.backText}>Publicações</Text>
      </Pressable>

      <View style={styles.result}>
        <View style={styles.trashIcon}>
          <Trash2 size={27} color="#DC2626" strokeWidth={2.2} />
        </View>

        <Text style={[styles.eyebrow, { color: '#DC2626' }]}>CONFIRMAR EXCLUSÃO</Text>
        <Text style={styles.title}>Tem certeza que deseja excluir?</Text>
        <Text style={styles.description}>
          {`Esta ação não pode ser desfeita. Isso excluirá permanentemente "${post?.title}"? de nossos servidores.`}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color="#4F46E5" style={{ marginVertical: 12 }} />
        ) : null}

        <View style={styles.actionBlock}>
          <Pressable
            accessibilityRole="button"
            onPress={handleConfirmDelete}
            disabled={deleting}
            style={[styles.deleteConfirmButton, deleting && styles.buttonDisabled]}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteConfirmText}>Sim, excluir publicação</Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            disabled={deleting}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    backgroundColor: '#F8FAFC',
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
  result: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingBottom: 48,
    gap: 13,
  },
  successIcon: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
  },
  trashIcon: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
  },
  eyebrow: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: '#172033',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    maxWidth: 320,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  notice: {
    width: '100%',
    maxWidth: 360,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 9,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  noticeText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
  },
  actionBlock: {
    width: '100%',
    maxWidth: 360,
    gap: 10,
    marginTop: 14,
  },
  deleteConfirmButton: {
    width: '100%',
    minHeight: 49,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#DC2626',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  deleteConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    width: '100%',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  returnButton: {
    width: '100%',
    maxWidth: 360,
    minHeight: 49,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    borderRadius: 11,
    backgroundColor: '#4F46E5',
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
