import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Linking, ScrollView, Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function CenterDetailsScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { provider, serviceType } = route.params;
  const service = provider.services?.[serviceType] || {};

  const handleCall = () => {
    const phone = provider.phone || provider.hotline;
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const handleHotline = () => {
    if (provider.hotline) Linking.openURL(`tel:${provider.hotline}`);
  };

  const handleOpenMap = () => {
    const lat = provider.location?.latitude;
    const lon = provider.location?.longitude;
    if (lat && lon) {
      Linking.openURL(`https://maps.google.com/?q=${lat},${lon}`);
    }
  };

  const handleThankYou = () => {
    navigation.navigate('ThankYou');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{provider.name || 'مركز طبي'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Center Photo */}
        <View style={styles.photoContainer}>
          {provider.photo ? (
            <Image source={{ uri: provider.photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>🏥</Text>
            </View>
          )}
        </View>

        {/* Discount Badge */}
        <View style={styles.discountContainer}>
          <View style={[
            styles.discountBadge,
            { backgroundColor: service.discount === 0 ? COLORS.free : COLORS.discount }
          ]}>
            <Text style={styles.discountText}>
              {service.discount === 0
                ? t('results.free')
                : t('results.discount', { percent: service.discount })}
            </Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 {t('center.address')}</Text>
            <Text style={styles.infoValue}>{provider.address || 'غير متوفر'}</Text>
          </View>

          {provider.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📞 الهاتف</Text>
              <Text style={styles.infoValue}>{provider.phone}</Text>
            </View>
          )}

          {provider.hotline && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>☎️ {t('center.hotline')}</Text>
              <Text style={styles.infoValue}>{provider.hotline}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <Text style={styles.callBtnText}>📞 {t('center.call')}</Text>
          </TouchableOpacity>

          {provider.hotline && (
            <TouchableOpacity style={styles.hotlineBtn} onPress={handleHotline}>
              <Text style={styles.hotlineBtnText}>☎️ {t('center.hotline')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.mapBtn} onPress={handleOpenMap}>
            <Text style={styles.mapBtnText}>🗺️ {t('center.openMap')}</Text>
          </TouchableOpacity>
        </View>

        {/* Done Button → Thank You */}
        <TouchableOpacity style={styles.doneBtn} onPress={handleThankYou}>
          <Text style={styles.doneBtnText}>✅ تم التواصل</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backBtn: {
    ...FONTS.regular,
    color: COLORS.primary,
    fontSize: 16,
  },
  title: {
    ...FONTS.title,
    color: COLORS.text,
    fontSize: 20,
    flex: 1,
    textAlign: 'right',
  },
  content: {
    paddingBottom: 40,
  },
  photoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: SIZES.borderRadiusLarge,
  },
  photoPlaceholder: {
    width: 200,
    height: 150,
    borderRadius: SIZES.borderRadiusLarge,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  photoIcon: {
    fontSize: 60,
  },
  discountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  discountBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  discountText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 18,
  },
  infoSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: SIZES.borderRadiusLarge,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    ...FONTS.bold,
    color: COLORS.text,
    fontSize: 14,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  callBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
  },
  callBtnText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
  hotlineBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
  },
  hotlineBtnText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
  mapBtn: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  mapBtnText: {
    color: COLORS.primary,
    ...FONTS.bold,
    fontSize: 16,
  },
  doneBtn: {
    backgroundColor: '#22C55E',
    marginHorizontal: 20,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneBtnText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
});
