
import { Link, router } from 'expo-router';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';

const posts = [
  {
    id: 1,
    title: 'Como começar um blog',
    category: 'Tutoriais',
    date: '09 out, 2026',
  },
  {
    id: 2,
    title: 'Organizando suas ideias',
    category: 'Produtividade',
    date: '08 out, 2026',
  },
  {
    id: 3,
    title: 'Boas práticas para escrever',
    category: 'Conteúdo',
    date: '07 out, 2026',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>TC Blogging</Text>
            <Text style={styles.subtitle}>
              Ideias que merecem ser compartilhadas.
            </Text>
          </View>

          <Link href="/auth" asChild>
            <Pressable style={styles.loginButton}>
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>NOSSO BLOG</Text>
          <Text style={styles.title}>Últimas publicações</Text>
          <Text style={styles.description}>
            Confira nossos artigos, dicas e novidades.
          </Text>
        </View>

        {posts.map((post) => (
          <Pressable key={post.id} style={styles.card} onPress={() => router.push(`/posts/${post.id}`)}>
            <Text style={styles.category}>{post.category}</Text>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.date}>{post.date}</Text>
          </Pressable>
        ))}

        <Text style={styles.footer}>TC Blogging © 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 56,
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: '#172033',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  hero: {
    marginBottom: 28,
  },
  eyebrow: {
    color: '#4F46E5',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#172033',
  },
  description: {
    color: '#64748B',
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  category: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#172033',
  },
  date: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 13,
  },
  footer: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 32,
    marginBottom: 16,
  },
});
