
import { router } from 'expo-router';
import { ArrowLeft, Check, UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DeleteTeacher() {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar para professores"
        onPress={() => router.replace('/admin/teachers')}
        style={styles.backButton}
      >
        <ArrowLeft size={18} color="#4F46E5" />
        <Text style={styles.backText}>Professores</Text>
      </Pressable>

      <View style={styles.result}>
        <View style={styles.successIcon}>
          <Check size={27} color="#4F46E5" strokeWidth={2.5} />
        </View>

        <Text style={styles.eyebrow}>AÇÃO CONCLUÍDA</Text>
        <Text style={styles.title}>Professor removido</Text>
        <Text style={styles.description}>
          O cadastro do professor foi removido com sucesso.
        </Text>

        <View style={styles.notice}>
          <UserRound size={17} color="#4F46E5" />
          <Text style={styles.noticeText}>
            A equipe docente foi atualizada.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/admin/teachers')}
          style={styles.returnButton}
        >
          <Text style={styles.returnButtonText}>Voltar para a listagem</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  backText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
  result: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingBottom: 48,
    gap: 13,
  },
  successIcon: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
  },
  eyebrow: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: '#172033',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    maxWidth: 300,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  notice: {
    width: '100%',
    maxWidth: 360,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 9,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  noticeText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
  },
  returnButton: {
    width: '100%',
    maxWidth: 360,
    minHeight: 49,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    borderRadius: 11,
    backgroundColor: '#4F46E5',
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
