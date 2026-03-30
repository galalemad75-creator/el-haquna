import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function ThankYouScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.secondary} barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.emoji}>🤲</Text>
        <Text style={styles.title}>{t('thankYou.title')}</Text>
        <Text style={styles.message}>{t('thankYou.message')}</Text>

        {/* AdMob Banner placeholder */}
        <View style={styles.adPlaceholder}>
          <Text style={styles.adText}>📢 إعلان</Text>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.homeBtnText}>{t('thankYou.backHome')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 26,
  },
  message: {
    ...FONTS.regular,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 40,
  },
  adPlaceholder: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  adText: {
    color: 'rgba(255,255,255,0.5)',
    ...FONTS.regular,
  },
  homeBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: SIZES.borderRadius,
  },
  homeBtnText: {
    color: COLORS.secondary,
    ...FONTS.bold,
    fontSize: 16,
  },
});
