import { View, Text, StyleSheet } from 'react-native';

export default function CreeatePost() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar post</Text>
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
