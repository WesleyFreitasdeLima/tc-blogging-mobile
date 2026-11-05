import { router, useFocusEffect } from "expo-router";
import { LogOut, Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/shared/contexts/auth";
import { postsService } from "@/shared/services/posts.service";
import type { Post } from "@/shared/types/post";

export default function DashboardScreen() {
  const { logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async (queryText: string) => {
    try {
      setLoading(true);
      const query = queryText.trim();
      let data: Post[] = [];

      if (query) {
        try {
          data = await postsService.search({ search: query });
        } catch {
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
      setPosts(data ?? []);
    } catch (error) {
      console.error("Erro ao carregar publicações:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts(search);
    }, [fetchPosts, search]),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, fetchPosts]);

  function handleRefresh() {
    setRefreshing(true);
    setSearch("");
    fetchPosts("");
  }

  function handleLogout() {
    Alert.alert("Sair da conta", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
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
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>PAINEL DE CONTROLE</Text>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.description}>
            Acompanhe e visualize as publicações da comunidade.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <LogOut size={16} color="#DC2626" strokeWidth={2.2} />
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
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
            <Text style={styles.date}>{formatDate(post.createdAt)}z</Text>
            <Text style={styles.postDescription}>
              {(post.coments?.length ?? 0 > 0)
                ? post.coments?.length + " Comentários"
                : ""}
            </Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 24,
  },
  headingCopy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    color: "#4F46E5",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#172033",
  },
  description: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 4,
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
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
    marginBottom: 20,
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
});
