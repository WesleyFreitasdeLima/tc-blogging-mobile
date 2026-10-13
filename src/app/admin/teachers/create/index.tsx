import { View, Text, StyleSheet } from 'react-native';

export default function CreeateTeachers() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar professor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
});
