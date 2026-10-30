import { router, useFocusEffect } from "expo-router";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/shared/contexts/auth";
import { postsService } from "@/shared/services/posts.service";
import { UserRoleEnum } from "@/shared/types/auth";
import type { Post } from "@/shared/types/post";

export default function PostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPage, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, loading } = useAuth();

  const hasPermission =
    !!user && [UserRoleEnum.ADMIN, UserRoleEnum.TEACHER].includes(user.role);

  useEffect(() => {
    if (loading) return;

    if (!user || !hasPermission) {
      router.replace("/admin");
    }
  }, [user, loading, hasPermission]);

  if (!hasPermission) return;

  const loadPosts = useCallback(async () => {
    try {
      const data = await postsService.getAll();
      setPosts(data ?? []);
    } catch (error) {
      console.error("Erro ao carregar postagens:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts]),
  );

  function handleRefresh() {
    setRefreshing(true);
    loadPosts();
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>PAINEL EDITORIAL</Text>
          <Text style={styles.title}>Publicações</Text>
          <Text style={styles.description}>
            Acompanhe e organize as publicações da comunidade.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/admin/posts/create")}
          style={styles.createButton}
        >
          <Plus size={19} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.createButtonText}>Nova publicação</Text>
        </Pressable>
      </View>

      <View style={styles.listHeading}>
        <Text style={styles.count}>
          {loadingPage
            ? "Carregando..."
            : posts.length === 1
              ? "1 publicação encontrada"
              : `${posts.length} publicações encontradas`}
        </Text>
      </View>

      {loadingPage && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#4F46E5"
              colors={["#4F46E5"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma publicação cadastrada.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <View style={styles.avatar}>
                  <FileText size={20} color="#4F46E5" strokeWidth={1.8} />
                </View>
                <View style={styles.nameBlock}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.createdBy?.name
                      ? `Por ${item.createdBy.name}`
                      : formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${item.title}`}
                  onPress={() => router.push(`/admin/posts/${item.id}/edit`)}
                  style={styles.editButton}
                >
                  <Pencil size={15} color="#4F46E5" strokeWidth={2} />
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir ${item.title}`}
                  onPress={() => router.push(`/admin/posts/${item.id}/delete`)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={15} color="#DC2626" strokeWidth={2} />
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    backgroundColor: "#F8FAFC",
  },
  header: {
    gap: 20,
  },
  headingCopy: {
    gap: 8,
  },
  eyebrow: {
    color: "#4F46E5",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  title: {
    color: "#172033",
    fontSize: 29,
    fontWeight: "800",
  },
  description: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
  },
  createButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 11,
    backgroundColor: "#4F46E5",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  listHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 14,
  },
  listLabel: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  count: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 28,
    gap: 12,
  },
  card: {
    padding: 16,
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: "#172033",
    fontSize: 15,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: "#64748B",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  editButton: {
    flex: 1,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 9,
    backgroundColor: "#EEF2FF",
  },
  editButtonText: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "700",
  },
  deleteButton: {
    flex: 1,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 9,
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 14,
    paddingVertical: 32,
  },
});
