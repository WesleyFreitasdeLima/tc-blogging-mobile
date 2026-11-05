import { isAxiosError } from "axios";
import { router } from "expo-router";
import {
  ArrowLeft,
  AtSign,
  Check,
  KeyRound,
  Mail,
  UserRound,
} from "lucide-react-native";
import { useState } from "react";
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

import { studentsService } from "@/shared/services/students.service";

export default function CreateStudennts() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const studentData = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
    };

    try {
      if (!studentData.name) {
        Alert.alert("Campo obrigatório", "Informe o nome do aluno.");
        return;
      }

      if (!studentData.username) {
        Alert.alert("Campo obrigatório", "Informe o nome de usuário.");
        return;
      }

      if (!studentData.email) {
        Alert.alert("Campo obrigatório", "Informe o e-mail do aluno.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
        Alert.alert("E-mail inválido", "Informe um endereço de e-mail válido.");
        return;
      }

      if (!studentData.password) {
        Alert.alert("Campo obrigatório", "Informe uma senha inicial.");
        return;
      }

      setSaving(true);
      await studentsService.create(studentData);
      router.replace("/admin/students");
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(
          "Erro ao cadastrar",
          error.response?.data?.message ||
            "Não foi possível cadastrar o aluno.",
        );
      } else if (error instanceof Error) {
        Alert.alert("Erro ao cadastrar", error.message);
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado ao cadastrar.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar para alunos"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ArrowLeft size={18} color="#4F46E5" />
        <Text style={styles.backText}>Alunos</Text>
      </Pressable>

      <View style={styles.heading}>
        <Text style={styles.eyebrow}>NOVO CADASTRO</Text>
        <Text style={styles.title}>Adicionar aluno</Text>
        <Text style={styles.description}>
          Preencha os dados para incluir um aluno.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldBlock}>
          <View style={styles.fieldHeader}>
            <View style={styles.fieldIcon}>
              <UserRound size={18} color="#4F46E5" />
            </View>
            <View style={styles.fieldCopy}>
              <Text style={styles.label}>Nome completo</Text>
              <Text style={styles.fieldHint}>
                Nome de exibição do aluno
              </Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Camila Ferreira"
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
            placeholder="Ex.: camila.ferreira"
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
              <Text style={styles.fieldHint}>
                Endereço de contato do aluno
              </Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="camila@exemplo.com"
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
              <Text style={styles.label}>Senha inicial</Text>
              <Text style={styles.fieldHint}>Defina a senha de acesso</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Defina uma senha inicial"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveButton, saving && styles.buttonDisabled]}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.saveButtonText}>Cadastrar aluno</Text>
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
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 26,
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
  heading: {
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
  form: {
    padding: 18,
    gap: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
  },
  fieldBlock: {
    gap: 10,
  },
  fieldHint: {
    color: "#94A3B8",
    fontSize: 12,
  },
  label: {
    color: "#172033",
    fontSize: 15,
    fontWeight: "600",
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
    borderRadius: 11,
    backgroundColor: "#4F46E5",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
