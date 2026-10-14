import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';

export default function PostsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts</Text>
      <Text style={styles.description}>
        Aqui ficará o gerenciamento das publicações.
      </Text>

      <Button
        title="Criar post"
        onPress={() => router.push('/admin/posts/create')}
      />

      <Button
        title="Editar post"
        onPress={() => router.push('/admin/posts/1/edit')}
      />

      <Button
        title="Excluir post"
        onPress={() => router.push('/admin/posts/1/delete')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  title: { fontSize: 28, fontWeight: '800', color: '#172033' },
  description: { color: '#64748B', marginTop: 12, lineHeight: 22 },
});
