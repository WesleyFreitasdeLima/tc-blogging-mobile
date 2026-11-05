import { isAxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, Trash2, UserRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { studentsService } from "@/shared/services/students.service";
import type { Student } from "@/shared/types/student";

export default function DeleteStudent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [teacher, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStudent() {
      if (!id) {
        setLoadError("O identificador do aluno não foi informado.");
        setLoading(false);
        return;
      }

      try {
        const data = await studentsService.getById(id);
        if (active) setStudent(data);
      } catch (error) {
        if (!active) return;
        console.error("Erro ao carregar aluno para exclusão:", error);
        setLoadError(
          isAxiosError(error)
            ? error.response?.data?.message ||
                "Não foi possível carregar o aluno."
            : "Não foi possível carregar o aluno.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStudent();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!id) return;

    try {
      setDeleting(true);
      await studentsService.delete(id);
      setDeleted(true);
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(
          "Erro ao excluir",
          error.response?.data?.message || "Não foi possível excluir o aluno.",
        );
      } else if (error instanceof Error) {
        Alert.alert("Erro ao excluir", error.message);
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado ao excluir.");
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (loadError || !teacher) {
    return (
      <View style={[styles.container, styles.center, styles.messageContainer]}>
        <View style={styles.iconBadge}>
          <UserRound size={25} color="#64748B" />
        </View>
        <Text style={styles.title}>Aluno indisponível</Text>
        <Text style={styles.description}>
          {loadError || "Esse cadastro não está disponível para exclusão."}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/admin/students")}
          style={styles.returnButton}
        >
          <Text style={styles.returnButtonText}>Voltar para alunoes</Text>
        </Pressable>
      </View>
    );
  }

  if (deleted) {
    return (
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar para alunoes"
          onPress={() => router.replace("/admin/students")}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color="#4F46E5" />
          <Text style={styles.backText}>alunoes</Text>
        </Pressable>

        <View style={styles.result}>
          <View style={styles.successIcon}>
            <Check size={27} color="#4F46E5" strokeWidth={2.5} />
          </View>
          <Text style={styles.eyebrow}>AÇÃO CONCLUÍDA</Text>
          <Text style={styles.title}>aluno removido</Text>
          <Text style={styles.description}>
            {teacher.name} foi removido da equipe docente.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/admin/students")}
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
        accessibilityLabel="Voltar para alunoes"
        onPress={() => router.back()}
        disabled={deleting}
        style={styles.backButton}
      >
        <ArrowLeft size={18} color="#4F46E5" />
        <Text style={styles.backText}>alunoes</Text>
      </Pressable>

      <View style={styles.result}>
        <View style={styles.trashIcon}>
          <Trash2 size={27} color="#DC2626" strokeWidth={2.2} />
        </View>
        <Text style={styles.dangerEyebrow}>CONFIRMAR EXCLUSÃO</Text>
        <Text style={styles.title}>Excluir aluno?</Text>
        <Text style={styles.description}>
          {`Esta ação não pode ser desfeita. O cadastro de ${teacher.name} será removido permanentemente.`}
        </Text>
        <View style={styles.notice}>
          <UserRound size={17} color="#4F46E5" />
          <Text style={styles.noticeText}>{teacher.email}</Text>
        </View>

        <View style={styles.actionBlock}>
          <Pressable
            accessibilityRole="button"
            onPress={handleDelete}
            disabled={deleting}
            style={[styles.deleteButton, deleting && styles.buttonDisabled]}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteButtonText}>Sim, excluir aluno</Text>
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
    backgroundColor: "#F8FAFC",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    padding: 24,
    gap: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
  },
  backText: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "700",
  },
  result: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingBottom: 48,
    gap: 13,
  },
  iconBadge: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
  },
  trashIcon: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
  },
  successIcon: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
  },
  eyebrow: {
    color: "#4F46E5",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  dangerEyebrow: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  title: {
    color: "#172033",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    maxWidth: 320,
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  notice: {
    width: "100%",
    maxWidth: 360,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
  },
  noticeText: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "600",
  },
  actionBlock: {
    width: "100%",
    maxWidth: 360,
    gap: 10,
    marginTop: 14,
  },
  deleteButton: {
    width: "100%",
    minHeight: 49,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#DC2626",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  cancelButton: {
    width: "100%",
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
  },
  cancelButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },
  returnButton: {
    width: "100%",
    maxWidth: 360,
    minHeight: 49,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    borderRadius: 11,
    backgroundColor: "#4F46E5",
  },
  returnButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
