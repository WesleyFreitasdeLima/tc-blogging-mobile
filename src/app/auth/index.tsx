import { router } from 'expo-router';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { z } from 'zod';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/shared/contexts/auth';
import { useState } from 'react';

export const FormAuthSchema = z.object({
  login: z.string().min(1, 'Informe o login'),
  password: z.string().min(1, 'Informe a senha'),
});

export type FormAuthData = z.infer<typeof FormAuthSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormAuthData>({
    resolver: zodResolver(FormAuthSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  async function onSubmit(data: FormAuthData) {
    setApiError('');

    try {
      await login(data.login, data.password);
      router.replace('/admin');
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Não foi possível realizar o login.',
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      {apiError ? (
        <Text style={{ color: 'red' }}>{apiError}</Text>
      ) : null}
      
      <View style={styles.field}>
        <Text style={styles.label}>Login</Text>

        <Controller
          control={control}
          name="login"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.login && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Digite seu login"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        />

        {errors.login && (
          <Text style={styles.errorText}>
            {errors.login.message}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Senha</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.password && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Digite sua senha"
              secureTextEntry
            />
          )}
        />

        {errors.password && (
          <Text style={styles.errorText}>
            {errors.password.message}
          </Text>
        )}
      </View>

      <Pressable
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 28,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    color: '#172033',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
  },
  button: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
