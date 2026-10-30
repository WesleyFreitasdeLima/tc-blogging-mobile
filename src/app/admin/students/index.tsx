import { router, useFocusEffect } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react-native";
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
import { studentsService } from "@/shared/services/students.service";
import { UserRoleEnum } from "@/shared/types/auth";
import type { Student } from "@/shared/types/student";

const PAGE_SIZE = 3;

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingPage, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadError, setLoadError] = useState("");

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

  const loadTtudents = useCallback(async () => {
    setLoadError("");

    try {
      const data = await studentsService.getAll();

      setStudents(data);
      setPage((currentPage) =>
        Math.min(currentPage, Math.max(1, Math.ceil(data.length / PAGE_SIZE))),
      );
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      setLoadError("Não foi possível carregar os alunos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTtudents();
    }, [loadTtudents]),
  );

  function handleRefresh() {
    setRefreshing(true);
    loadTtudents();
  }

  const pageCount = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const visiblestudents = students.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>GESTÃO ACADÊMICA</Text>
          <Text style={styles.title}>Alunos</Text>
          <Text style={styles.description}>
            Acompanhe e gerencie os alunos.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/admin/students/create")}
          style={styles.createButton}
        >
          <Plus size={19} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.createButtonText}>Novo Aluno</Text>
        </Pressable>
      </View>

      <View style={styles.listHeading}>
        <Text style={styles.count}>
          {loadingPage
            ? "Carregando..."
            : students.length === 1
              ? "1 Aluno encontrado"
              : `${students.length} Alunos encontrados`}
        </Text>
      </View>

      {loadingPage && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={visiblestudents}
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
            <Text style={styles.empty}>
              {loadError || "Nenhum professor cadastrado."}
            </Text>
          }
          ListFooterComponent={
            students.length > PAGE_SIZE ? (
              <View style={styles.pagination}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Página anterior"
                  disabled={page === 1}
                  onPress={() => setPage((currentPage) => currentPage - 1)}
                  style={[
                    styles.pageButton,
                    page === 1 && styles.pageButtonDisabled,
                  ]}
                >
                  <ChevronLeft
                    size={18}
                    color={page === 1 ? "#CBD5E1" : "#4F46E5"}
                  />
                </Pressable>
                <Text style={styles.pageLabel}>
                  Página {page} de {pageCount}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Próxima página"
                  disabled={page === pageCount}
                  onPress={() => setPage((currentPage) => currentPage + 1)}
                  style={[
                    styles.pageButton,
                    page === pageCount && styles.pageButtonDisabled,
                  ]}
                >
                  <ChevronRight
                    size={18}
                    color={page === pageCount ? "#CBD5E1" : "#4F46E5"}
                  />
                </Pressable>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <View style={styles.avatar}>
                  <UserRound size={21} color="#4F46E5" strokeWidth={1.8} />
                </View>
                <View style={styles.nameBlock}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentRole}>{item.email}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${item.name}`}
                  onPress={() => router.push(`/admin/students/${item.id}/edit`)}
                  style={styles.editButton}
                >
                  <Pencil size={15} color="#4F46E5" strokeWidth={2} />
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir ${item.name}`}
                  onPress={() =>
                    router.push(`/admin/students/${item.id}/delete`)
                  }
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
    gap: 7,
  },
  eyebrow: {
    color: "#4F46E5",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#172033",
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
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 10,
  },
  listLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  count: {
    color: "#64748B",
    fontSize: 12,
  },
  list: {
    paddingBottom: 20,
    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  studentCard: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 15,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
  },
  nameBlock: {
    flex: 1,
    gap: 3,
  },
  studentName: {
    color: "#172033",
    fontSize: 16,
    fontWeight: "700",
  },
  studentRole: {
    color: "#94A3B8",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 9,
  },
  editButton: {
    flex: 1,
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
  },
  editButtonText: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "700",
  },
  deleteButton: {
    flex: 1,
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
  },
  deleteButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
  },
  empty: {
    color: "#64748B",
    textAlign: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingVertical: 18,
  },
  pageButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
  },
  pageButtonDisabled: {
    backgroundColor: "#F1F5F9",
  },
  pageLabel: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
});
