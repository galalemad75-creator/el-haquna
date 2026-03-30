import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { registerProvider, createProvider } from '../services/firestore';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [centerName, setCenterName] = useState('');
  const [phone, setPhone] = useState('');
  const [hotline, setHotline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !centerName || !phone) {
      Alert.alert(t('common.error'), 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    try {
      const userCred = await registerProvider(email, password);
      await createProvider({
        userId: userCred.user.uid,
        name: centerName,
        phone,
        hotline,
        email,
      });
      navigation.replace('ProviderSetup', { userId: userCred.user.uid });
    } catch (error) {
      Alert.alert(t('common.error'), 'فشل إنشاء الحساب');
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>🏥</Text>
        <Text style={styles.title}>{t('auth.register')}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{t('auth.centerName')} *</Text>
          <TextInput
            style={styles.input}
            value={centerName}
            onChangeText={setCenterName}
            placeholder="اسم المركز الطبي"
            placeholderTextColor={COLORS.textSecondary}
            textAlign="right"
          />

          <Text style={styles.label}>{t('auth.email')} *</Text>
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

          <Text style={styles.label}>{t('auth.password')} *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry
            textAlign="right"
          />

          <Text style={styles.label}>{t('auth.phone')} *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="01xxxxxxxxx"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="phone-pad"
            textAlign="right"
          />

          <Text style={styles.label}>{t('auth.hotline')}</Text>
          <TextInput
            style={styles.input}
            value={hotline}
            onChangeText={setHotline}
            placeholder="123"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="phone-pad"
            textAlign="right"
          />

          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerBtnText}>
              {loading ? t('common.loading') : t('auth.register')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 26,
    marginBottom: 24,
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
  registerBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerBtnDisabled: {
    opacity: 0.6,
  },
  registerBtnText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
});
