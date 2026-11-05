import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  MessageCircle,
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/shared/contexts/auth";
import { postsService } from "@/shared/services/posts.service";

import { comentsService } from "@/shared/services/coments.service";
import { UserRoleEnum } from "@/shared/types/auth";
import type { Coment } from "@/shared/types/coment";
import type { Post } from "@/shared/types/post";

export default function PostDetails() {
  const { id, action } = useLocalSearchParams<{
    id: string;
    action?: string;
  }>();

  const { user, loading: authLoading } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [commentContent, setCommentContent] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const [savingComment, setSavingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );

  const isAdmin = user?.role === UserRoleEnum.ADMIN;

  const loadPost = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await postsService.getById(id);

      setPost(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes do post:", error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  // Se o usuário retornar do login com action=comment,
  // abre automaticamente o formulário de comentário.
  useEffect(() => {
    if (action === "comment" && !authLoading && user) {
      setShowComposer(true);
    }
  }, [action, authLoading, user]);

  function formatDate(dateString?: string) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateTime(dateString?: string) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleCommentAccess() {
    if (authLoading) return;

    if (!user) {
      router.push({
        pathname: "/auth",
        params: {
          returnTo: `/posts/${id}?action=comment`,
        },
      });

      return;
    }

    setShowComposer(true);
  }

  function handleCancelEdit() {
    setEditingCommentId(null);
    setCommentContent("");
    setShowComposer(false);
  }

  function handleEditComment(comment: Coment) {
    if (!user) {
      handleCommentAccess();
      return;
    }

    setEditingCommentId(comment.id);
    setCommentContent(comment.content);
    setShowComposer(true);
  }

  async function handleSaveComment() {
    if (!user) {
      handleCommentAccess();
      return;
    }

    const content = commentContent.trim();

    if (!content) {
      Alert.alert("Atenção", "Digite o conteúdo do comentário.");
      return;
    }

    try {
      setSavingComment(true);

      if (editingCommentId !== null) {
        await comentsService.update(editingCommentId, {
          content,
        });
      } else {
        await comentsService.create({
          post: Number(id),
          content: content,
        });
      }

      setCommentContent("");
      setEditingCommentId(null);
      setShowComposer(false);

      await loadPost();
    } catch (error) {
      console.error("Erro ao salvar comentário:", error);

      Alert.alert(
        "Erro",
        "Não foi possível salvar o comentário. Tente novamente.",
      );
    } finally {
      setSavingComment(false);
    }
  }

  async function deleteComment(commentId: number) {
    try {
      setDeletingCommentId(commentId);

      await comentsService.delete(commentId);

      if (editingCommentId === commentId) {
        handleCancelEdit();
      }

      await loadPost();
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);

      Alert.alert(
        "Erro",
        "Não foi possível excluir o comentário. Tente novamente.",
      );
    } finally {
      setDeletingCommentId(null);
    }
  }

  function handleDeleteComment(commentId: number) {
    const confirmDelete = () => {
      void deleteComment(commentId);
    };

    // Alert.alert não apresenta confirmação de forma consistente na Web.
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm("Deseja realmente excluir este comentário?")) {
        confirmDelete();
      }

      return;
    }

    Alert.alert(
      "Excluir comentário",
      "Deseja realmente excluir este comentário?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
    );
  }

  function canManageComment(comment: Coment) {
    if (!user) return false;

    return (
      isAdmin ||
      user.role == UserRoleEnum.TEACHER ||
      Number(comment.createdBy?.id) === Number(user.id)
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (!user) {
              router.replace("/");
            } else {
              router.replace("/admin");
            }
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color="#4F46E5" />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4F46E5"
            style={styles.loading}
          />
        ) : post ? (
          <>
            {/* ARTIGO */}
            <View style={styles.article}>
              <Text style={styles.category}>
                {post.createdBy?.name
                  ? `POR ${post.createdBy.name.toUpperCase()}`
                  : "ARTIGO"}
              </Text>

              <Text style={styles.title}>{post.title}</Text>

              <Text style={styles.date}>{formatDate(post.createdAt)}</Text>

              <Text style={styles.content}>{post.content}</Text>
            </View>

            {/* COMENTÁRIOS */}
            <View style={styles.commentsSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <MessageCircle size={21} color="#4F46E5" />

                  <Text style={styles.sectionTitle}>
                    Comentários ({post.coments?.length ?? 0})
                  </Text>
                </View>

                {!showComposer && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleCommentAccess}
                    style={styles.commentButton}
                  >
                    <Text style={styles.commentButtonText}>Comentar</Text>
                  </Pressable>
                )}
              </View>

              {/* FORMULÁRIO DE COMENTÁRIO */}
              {showComposer && (
                <View style={styles.composer}>
                  <Text style={styles.composerTitle}>
                    {editingCommentId !== null
                      ? "Editar comentário"
                      : "Escreva seu comentário"}
                  </Text>

                  <TextInput
                    value={commentContent}
                    onChangeText={setCommentContent}
                    placeholder="O que você achou desta publicação?"
                    placeholderTextColor="#94A3B8"
                    multiline
                    editable={!savingComment}
                    textAlignVertical="top"
                    style={styles.commentInput}
                    accessibilityLabel="Conteúdo do comentário"
                  />

                  <View style={styles.composerActions}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={handleCancelEdit}
                      disabled={savingComment}
                      style={styles.cancelButton}
                    >
                      <X size={16} color="#64748B" />

                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      onPress={handleSaveComment}
                      disabled={savingComment || !commentContent.trim()}
                      style={[
                        styles.submitButton,
                        (savingComment || !commentContent.trim()) &&
                          styles.disabledButton,
                      ]}
                    >
                      {savingComment ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Send size={16} color="#FFFFFF" />
                      )}

                      <Text style={styles.submitButtonText}>
                        {savingComment
                          ? "Salvando..."
                          : editingCommentId !== null
                            ? "Salvar alterações"
                            : "Publicar comentário"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* LISTA DE COMENTÁRIOS */}
              {!post.coments?.length ? (
                <View style={styles.emptyComments}>
                  <MessageCircle size={30} color="#CBD5E1" />

                  <Text style={styles.emptyCommentsTitle}>
                    Nenhum comentário ainda
                  </Text>

                  <Text style={styles.emptyCommentsText}>
                    Seja a primeira pessoa a comentar nesta publicação.
                  </Text>
                </View>
              ) : (
                post.coments.map((comment) => {
                  const canManage = canManageComment(comment);
                  const isEditing = editingCommentId === comment.id;
                  const isDeleting = deletingCommentId === comment.id;

                  return (
                    <View key={comment.id} style={styles.commentCard}>
                      <View style={styles.commentHeader}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>
                            {comment.createdBy?.name
                              ?.trim()
                              .charAt(0)
                              .toUpperCase() ?? "?"}
                          </Text>
                        </View>

                        <View style={styles.commentAuthorInfo}>
                          <Text style={styles.commentAuthor}>
                            {comment.createdBy?.name ?? "Usuário"}
                          </Text>

                          <Text style={styles.commentDate}>
                            {formatDateTime(comment.createdAt)}
                          </Text>
                        </View>

                        {user && canManageComment(comment) && (
                          <View style={styles.commentActions}>
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel="Editar comentário"
                              onPress={() => handleEditComment(comment)}
                              disabled={isDeleting || isEditing}
                              style={styles.iconButton}
                            >
                              <Pencil size={17} color="#4F46E5" />
                            </Pressable>

                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel="Excluir comentário"
                              onPress={() => handleDeleteComment(comment.id)}
                              disabled={isDeleting}
                              style={styles.iconButton}
                            >
                              {isDeleting ? (
                                <ActivityIndicator
                                  size="small"
                                  color="#DC2626"
                                />
                              ) : (
                                <Trash2 size={17} color="#DC2626" />
                              )}
                            </Pressable>
                          </View>
                        )}
                      </View>

                      <Text style={styles.commentContent}>
                        {comment.content}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          </>
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
    backgroundColor: "#F8FAFC",
  },
  container: {
    padding: 24,
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  loading: {
    marginTop: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    marginBottom: 24,
  },
  backText: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "700",
  },
  article: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  category: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#172033",
    lineHeight: 34,
  },
  date: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 20,
  },
  content: {
    color: "#334155",
    fontSize: 16,
    lineHeight: 26,
  },
  empty: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 40,
  },

  // Seção de comentários
  commentsSection: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  sectionTitle: {
    color: "#172033",
    fontSize: 20,
    fontWeight: "800",
  },
  commentButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  commentButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // Formulário
  composer: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    marginBottom: 18,
  },
  composerTitle: {
    color: "#172033",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  commentInput: {
    minHeight: 120,
    maxHeight: 260,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: "#FFFFFF",
  },
  composerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: "#F1F5F9",
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: "#4F46E5",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },

  // Comentários individuais
  commentCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#4F46E5",
    fontWeight: "800",
    fontSize: 16,
  },
  commentAuthorInfo: {
    flex: 1,
  },
  commentAuthor: {
    color: "#172033",
    fontSize: 14,
    fontWeight: "700",
  },
  commentDate: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 3,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  commentContent: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
  editedLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontStyle: "italic",
    marginTop: 8,
  },

  // Lista vazia
  emptyComments: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  emptyCommentsTitle: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
  },
  emptyCommentsText: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
});
