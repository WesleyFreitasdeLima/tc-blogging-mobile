import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { postsService } from '@/shared/services/posts.service';
import type { Post } from '@/shared/types/post';

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await postsService.getById(id);
        setPost(data);
      } catch (error) {
        console.error('Erro ao carregar detalhes do post:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color="#4F46E5" />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4F46E5"
            style={{ marginTop: 40 }}
          />
        ) : post ? (
          <View style={styles.article}>
            <Text style={styles.category}>
              {post.createdBy?.name
                ? `POR ${post.createdBy.name.toUpperCase()}`
                : 'ARTIGO'}
            </Text>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
            <Text style={styles.content}>{post.content}</Text>
          </View>
        ) : (
          <Text style={styles.empty}>Publicação não encontrada.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 24,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    marginBottom: 24,
  },
  backText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
  article: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  category: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#172033',
    lineHeight: 34,
  },
  date: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 20,
  },
  content: {
    color: '#334155',
    fontSize: 16,
    lineHeight: 26,
  },
  empty: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 15,
    marginTop: 40,
  },
});
