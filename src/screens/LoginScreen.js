import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { loginProvider } from '../services/firestore';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), 'يرجى ملء جميع الحقول');
      return;
    }
    setLoading(true);
    try {
      const userCred = await loginProvider(email, password);
      navigation.replace('ProviderDashboard', { userId: userCred.user.uid });
    } catch (error) {
      Alert.alert(t('common.error'), 'بيانات الدخول غير صحيحة');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← {t('common.back')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.logo}>🏥</Text>
        <Text style={styles.title}>{t('auth.login')}</Text>
        <Text style={styles.subtitle}>بوابة المراكز الطبية</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{t('auth.email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="example@center.com"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            textAlign="right"
          />

          <Text style={styles.label}>{t('auth.password')}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry
            textAlign="right"
          />

          <TouchableOpacity>
            <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? t('common.loading') : t('auth.login')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLinkText}>
              ليس لديك حساب؟ <Text style={styles.registerBold}>{t('auth.register')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backBtn: {
    ...FONTS.regular,
    color: COLORS.primary,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 28,
  },
  subtitle: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {},
  label: {
    ...FONTS.regular,
    color: COLORS.text,
    marginBottom: 6,
    textAlign: 'right',
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...FONTS.regular,
    color: COLORS.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
  },
  forgotText: {
    ...FONTS.regular,
    color: COLORS.primary,
    textAlign: 'left',
    marginBottom: 24,
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
  registerLink: {
    alignItems: 'center',
  },
  registerLinkText: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  registerBold: {
    color: COLORS.primary,
    ...FONTS.bold,
  },
});
