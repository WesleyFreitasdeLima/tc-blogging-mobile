import { isAxiosError } from "axios";
import { router } from "expo-router";
import {
  AtSign,
  Check,
  KeyRound,
  Mail,
  Trash2,
  UserRound,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/shared/contexts/auth";
import { authService } from "@/shared/services/auth.service";
import { UserRoleEnum } from "@/shared/types/auth";

export default function ProfileScreen() {
  const { user, loading: authLoading, updateUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setUsername(user.username ?? "");
    setEmail(user.email ?? "");
  }, [user]);

  async function handleSave() {
    const profileData = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      ...(password ? { password } : {}),
    };

    if (!profileData.name || !profileData.username || !profileData.email) {
      Alert.alert("Campos obrigatórios", "Preencha nome, usuário e e-mail.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      Alert.alert("E-mail inválido", "Informe um endereço de e-mail válido.");
      return;
    }

    try {
      setSaving(true);
      const updatedUser = await authService.updateMe(profileData);
      updateUser(updatedUser);
      setPassword("");
      Alert.alert("Perfil atualizado", "Seus dados foram salvos com sucesso.");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          "Não foi possível atualizar seu perfil."
        : error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado ao salvar.";
      Alert.alert("Erro ao salvar", message);
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Excluir conta",
      "Esta ação é permanente e removerá seu acesso ao sistema. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir conta",
          style: "destructive",
          onPress: () => void handleDelete(),
        },
      ],
    );
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await authService.deleteMe();
      await logout();
      Alert.alert("Conta excluída", "Sua conta foi removida.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Não foi possível excluir sua conta."
        : error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado ao excluir a conta.";
      Alert.alert("Erro ao excluir", message);
    } finally {
      setDeleting(false);
    }
  }

  if (authLoading || !user) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#4F46E5" />
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
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>CONTA</Text>
        <Text style={styles.title}>Meu perfil</Text>
        <Text style={styles.description}>
          Consulte e atualize seus dados pessoais.
        </Text>
      </View>

      <View style={styles.identity}>
        <View style={styles.identityIcon}>
          <UserRound size={25} color="#4F46E5" />
        </View>
        <View style={styles.identityCopy}>
          <Text style={styles.identityName}>{user.name}</Text>
          <Text style={styles.identityRole}>
            {user.role === UserRoleEnum.ADMIN
              ? "Administrador"
              : user.role === UserRoleEnum.TEACHER
                ? "Professor"
                : "Aluno"}
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldBlock}>
          <View style={styles.fieldHeader}>
            <View style={styles.fieldIcon}>
              <UserRound size={18} color="#4F46E5" />
            </View>
            <View style={styles.fieldCopy}>
              <Text style={styles.label}>Nome completo</Text>
              <Text style={styles.fieldHint}>Seu nome de exibição</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>

        <View style={styles.fieldBlock}>
          <View style={styles.fieldHeader}>
            <View style={styles.fieldIcon}>
              <AtSign size={18} color="#4F46E5" />
            </View>
            <View style={styles.fieldCopy}>
              <Text style={styles.label}>Nome de usuário</Text>
              <Text style={styles.fieldHint}>Usado para entrar no app</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            placeholderTextColor="#94A3B8"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            returnKeyType="next"
          />
        </View>

        <View style={styles.fieldBlock}>
          <View style={styles.fieldHeader}>
            <View style={styles.fieldIcon}>
              <Mail size={18} color="#4F46E5" />
            </View>
            <View style={styles.fieldCopy}>
              <Text style={styles.label}>E-mail</Text>
              <Text style={styles.fieldHint}>Seu endereço de contato</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="voce@exemplo.com"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
          />
        </View>

        <View style={styles.fieldBlock}>
          <View style={styles.fieldHeader}>
            <View style={styles.fieldIcon}>
              <KeyRound size={18} color="#4F46E5" />
            </View>
            <View style={styles.fieldCopy}>
              <Text style={styles.label}>Nova senha</Text>
              <Text style={styles.fieldHint}>
                Deixe em branco para manter a atual
              </Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Opcional"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            textContentType="newPassword"
            returnKeyType="done"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          disabled={saving || deleting}
          style={[
            styles.saveButton,
            (saving || deleting) && styles.buttonDisabled,
          ]}
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

      <View style={styles.dangerSection}>
        <View style={styles.dangerHeading}>
          <Text style={styles.dangerTitle}>Excluir conta</Text>
          <Text style={styles.dangerDescription}>
            A exclusão é permanente. Publicações relacionadas podem impedir a
            remoção.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={confirmDelete}
          disabled={saving || deleting}
          style={[
            styles.deleteButton,
            (saving || deleting) && styles.buttonDisabled,
          ]}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Trash2 size={17} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Excluir minha conta</Text>
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
    backgroundColor: "#F8FAFC",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 36,
    gap: 20,
  },
  heading: {
    gap: 7,
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
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  identityIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
  },
  identityCopy: {
    flex: 1,
    gap: 4,
  },
  identityName: {
    color: "#172033",
    fontSize: 16,
    fontWeight: "700",
  },
  identityRole: {
    color: "#64748B",
    fontSize: 13,
  },
  form: {
    padding: 18,
    gap: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  fieldBlock: {
    gap: 10,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  fieldIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
  },
  fieldCopy: {
    gap: 3,
  },
  label: {
    color: "#172033",
    fontSize: 15,
    fontWeight: "600",
  },
  fieldHint: {
    color: "#94A3B8",
    fontSize: 12,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    color: "#172033",
    fontSize: 16,
  },
  saveButton: {
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 4,
    borderRadius: 11,
    backgroundColor: "#4F46E5",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  dangerSection: {
    gap: 13,
    paddingTop: 6,
    paddingBottom: 10,
  },
  dangerHeading: {
    gap: 5,
  },
  dangerTitle: {
    color: "#172033",
    fontSize: 17,
    fontWeight: "700",
  },
  dangerDescription: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
  },
  deleteButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 11,
    backgroundColor: "#DC2626",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
