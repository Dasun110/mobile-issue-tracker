import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '../components/AppLogo';
import { mockLogin } from '../services/mockApi';
import { useAuthStore } from '../store/useAuthStore';
import { getPalette } from '../theme/palette';
import { RootStackParamList } from '../types/navigation';
import { validateEmail, validatePassword } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = (_props: Props): JSX.Element => {
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme);
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (): Promise<void> => {
    const foundEmailError = validateEmail(email);
    const foundPasswordError = validatePassword(password);

    setEmailError(foundEmailError);
    setPasswordError(foundPasswordError);

    if (foundEmailError || foundPasswordError) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await mockLogin(email, password);
      login(response.email, response.token);
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.hero}>
        <AppLogo colorScheme={colorScheme} />
        <Text style={[styles.heroTitle, { color: palette.text }]}>Track Issues Better</Text>
        <Text style={[styles.heroSubtitle, { color: palette.textMuted }]}>
          Clean workflow for reporting, triaging and resolving team issues.
        </Text>
      </View>
      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            shadowColor: palette.shadow,
          },
        ]}
      >
        <View style={[styles.badge, { backgroundColor: palette.accentSoft }]}>
          <Text style={[styles.badgeText, { color: palette.accent }]}>Issue Tracker</Text>
        </View>
        <Text style={[styles.heading, { color: palette.text }]}>Welcome back</Text>
        <Text style={[styles.subheading, { color: palette.textMuted }]}>Use any email and a 6+ character password.</Text>

        <TextInput
          style={[
            styles.input,
            { borderColor: palette.border, color: palette.text, backgroundColor: palette.background },
            emailError ? { borderColor: palette.errorSoft } : null,
          ]}
          placeholder="Email"
          placeholderTextColor={palette.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {emailError ? <Text style={[styles.error, { color: palette.danger }]}>{emailError}</Text> : null}

        <TextInput
          style={[
            styles.input,
            { borderColor: palette.border, color: palette.text, backgroundColor: palette.background },
            passwordError ? { borderColor: palette.errorSoft } : null,
          ]}
          placeholder="Password"
          placeholderTextColor={palette.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? (
          <Text style={[styles.error, { color: palette.danger }]}>{passwordError}</Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: palette.accent, opacity: pressed || submitting ? 0.9 : 1 },
          ]}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={palette.white} />
          ) : (
            <Text style={[styles.buttonText, { color: palette.textOnAccent }]}>Login</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  hero: {
    marginBottom: 14,
    gap: 8,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 38,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  subheading: {
    marginTop: 8,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  error: {
    marginBottom: 8,
  },
  button: {
    marginTop: 14,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 13,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 15,
  },
});

