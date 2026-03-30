import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch,
  StatusBar, Alert, ScrollView, TextInput
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { updateProviderService } from '../services/firestore';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const SERVICE_CONFIG = [
  { key: 'icu', icon: '❤️', color: '#EF4444' },
  { key: 'incubator', icon: '👶', color: '#F59E0B' },
  { key: 'radiation', icon: '☢️', color: '#8B5CF6' },
];

export default function ProviderDashboardScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { userId } = route.params;
  const [provider, setProvider] = useState(null);
  const [providerDocId, setProviderDocId] = useState(null);

  useEffect(() => {
    // Listen for real-time updates to the provider document
    const unsub = onSnapshot(
      doc(db, 'providers', userId),
      (snapshot) => {
        if (snapshot.exists()) {
          setProvider(snapshot.data());
          setProviderDocId(snapshot.id);
        }
      },
      (error) => {
        console.error('Provider listener error:', error);
      }
    );
    return () => unsub();
  }, [userId]);

  const toggleService = async (serviceKey) => {
    const current = provider?.services?.[serviceKey] || { available: false, discount: 0 };
    await updateProviderService(userId, serviceKey, {
      ...current,
      available: !current.available,
    });
  };

  const updateDiscount = async (serviceKey, discountStr) => {
    const discount = parseInt(discountStr) || 0;
    const current = provider?.services?.[serviceKey] || { available: false, discount: 0 };
    await updateProviderService(userId, serviceKey, {
      ...current,
      discount: Math.min(100, Math.max(0, discount)),
    });
  };

  if (!provider) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.logoutBtn}>خروج</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{t('provider.dashboard')}</Text>
          <Text style={styles.centerName}>{provider.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{t('center.services')}</Text>

        {SERVICE_CONFIG.map((service) => {
          const serviceData = provider.services?.[service.key] || { available: false, discount: 0 };
          return (
            <View key={service.key} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceLeft}>
                  <Switch
                    value={serviceData.available}
                    onValueChange={() => toggleService(service.key)}
                    trackColor={{ false: COLORS.border, true: service.color }}
                    thumbColor={COLORS.white}
                  />
                </View>
                <View style={styles.serviceRight}>
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                  <Text style={styles.serviceName}>{t(`services.${service.key}`)}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: serviceData.available ? COLORS.success : COLORS.error }
                  ]}>
                    <Text style={styles.statusText}>
                      {serviceData.available ? t('services.available') : t('services.closed')}
                    </Text>
                  </View>
                </View>
              </View>

              {serviceData.available && (
                <View style={styles.discountSection}>
                  <Text style={styles.discountLabel}>{t('services.discount')}:</Text>
                  <View style={styles.discountInputRow}>
                    <Text style={styles.percentSign}>%</Text>
                    <TextInput
                      style={styles.discountInput}
                      value={String(serviceData.discount)}
                      onChangeText={(val) => updateDiscount(service.key, val)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={COLORS.textSecondary}
                      maxLength={3}
                    />
                    <Text style={styles.discountHint}>
                      {serviceData.discount === 0 ? t('results.free') : `خصم ${serviceData.discount}%`}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* Reminder Info */}
        <View style={styles.reminderInfo}>
          <Text style={styles.reminderIcon}>🔔</Text>
          <Text style={styles.reminderText}>
            ستتلقى تنبيهاً كل 6 ساعات عند إغلاق أي خدمة للتأكيد
          </Text>
        </View>
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
  loading: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    ...FONTS.regular,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logoutBtn: {
    ...FONTS.regular,
    color: COLORS.error,
    fontSize: 14,
  },
  title: {
    ...FONTS.title,
    color: COLORS.text,
    textAlign: 'right',
  },
  centerName: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'right',
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    ...FONTS.bold,
    color: COLORS.text,
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusLarge,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceLeft: {},
  serviceRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  serviceIcon: {
    fontSize: 28,
  },
  serviceName: {
    ...FONTS.bold,
    color: COLORS.text,
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 11,
    ...FONTS.bold,
  },
  discountSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  discountLabel: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginBottom: 8,
    fontSize: 13,
  },
  discountInputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  discountInput: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: 80,
    textAlign: 'center',
    ...FONTS.bold,
    color: COLORS.text,
    fontSize: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  percentSign: {
    ...FONTS.bold,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  discountHint: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  reminderInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginTop: 12,
    gap: 8,
  },
  reminderIcon: {
    fontSize: 20,
  },
  reminderText: {
    ...FONTS.regular,
    color: '#92400E',
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
});
