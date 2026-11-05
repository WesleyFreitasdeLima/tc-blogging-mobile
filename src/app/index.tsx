import { Link, router } from "expo-router";
import { BookOpen, LogIn, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/shared/contexts/auth";
import { postsService } from "@/shared/services/posts.service";
import { UserRoleEnum } from "@/shared/types/auth";
import type { Post } from "@/shared/types/post";

export default function HomeScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchPosts() {
      try {
        setLoading(true);
        const query = search.trim();
        let data: Post[] = [];

        if (query) {
          try {
            data = await postsService.search({ search: query });
          } catch {
            // Fallback: filtra os posts localmente se a busca na API encontrar instabilidade
            const all = await postsService.getAll();
            data = all.filter(
              (p) =>
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.content.toLowerCase().includes(query.toLowerCase()) ||
                p.createdBy?.name?.toLowerCase().includes(query.toLowerCase()),
            );
          }
        } else {
          data = await postsService.getAll();
        }

        if (active) {
          setPosts(data ?? []);
        }
      } catch (error) {
        console.error("Erro ao carregar publicações:", error);
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    const timer = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search]);

  function handleRefresh() {
    setRefreshing(true);
    setSearch("");
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4F46E5"
            colors={["#4F46E5"]}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <View style={styles.brandContainer}>
              <BookOpen size={24} color="#4F46E5" strokeWidth={2.4} />
              <Text style={styles.brand}>TC Blogging</Text>
            </View>
            <Text style={styles.subtitle}>
              Pensar junto muda o que podemos fazer.
            </Text>
          </View>

          <Link
            href={
              user
                ? user.role == UserRoleEnum.STUDENT
                  ? "/admin/profile"
                  : "/admin"
                : "/auth"
            }
            asChild
          >
            <Pressable style={styles.loginButton}>
              <LogIn size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.loginText}>
                {user
                  ? user.role == UserRoleEnum.STUDENT
                    ? "Perfil"
                    : "Administração"
                  : "Entrar"}
              </Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>POSTS</Text>
          <Text style={styles.title}>Publicações recentes</Text>
          <Text style={styles.description}>
            Confira nossos artigos, dicas e novidades.
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar publicações..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color="#4F46E5"
            style={{ marginVertical: 32 }}
          />
        ) : posts.length === 0 ? (
          <Text style={styles.empty}>
            {search.trim()
              ? `Nenhum post encontrado para "${search}".`
              : "Nenhuma publicação cadastrada no momento."}
          </Text>
        ) : (
          posts.map((post) => (
            <Pressable
              key={post.id}
              style={styles.card}
              onPress={() => router.push(`/posts/${post.id}`)}
            >
              <Text style={styles.category}>
                {post.createdBy?.name
                  ? `POR ${post.createdBy.name.toUpperCase()}`
                  : "ARTIGO"}
              </Text>
              <Text style={styles.postTitle}>{post.title}</Text>
              {post.content ? (
                <Text style={styles.postDescription} numberOfLines={3}>
                  {post.content}
                </Text>
              ) : null}
              <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
              <Text style={styles.postDescription}>
                {(post.coments?.length ?? 0 > 0)
                  ? post.coments?.length + " Comentários"
                  : ""}
              </Text>
            </Pressable>
          ))
        )}

        <Text style={styles.footer}>TC Blogging © 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 56,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#172033",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loginText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  hero: {
    marginBottom: 28,
  },
  eyebrow: {
    color: "#4F46E5",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#172033",
  },
  description: {
    color: "#64748B",
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#172033",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  category: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#172033",
  },
  postDescription: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  date: {
    color: "#94A3B8",
    marginTop: 12,
    fontSize: 13,
  },
  empty: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 15,
    marginVertical: 40,
  },
  footer: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 32,
    marginBottom: 16,
  },
});
