import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, ActivityIndicator, Linking
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { getProvidersByService } from '../services/firestore';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function ResultsScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { serviceType, userLocation } = route.params;
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const lat = userLocation?.latitude || 30.0444;
      const lon = userLocation?.longitude || 31.2357;
      const results = await getProvidersByService(serviceType, lat, lon);
      setProviders(results);
    } catch (error) {
      console.error('Error loading providers:', error);
    }
    setLoading(false);
  };

  const getDiscountBadge = (service) => {
    if (service.discount === 0) {
      return { text: t('results.free'), color: COLORS.free };
    }
    return { text: t('results.discount', { percent: service.discount }), color: COLORS.discount };
  };

  const renderProvider = ({ item, index }) => {
    const service = item.services?.[serviceType] || {};
    const badge = getDiscountBadge(service);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CenterDetails', {
          provider: item,
          serviceType,
        })}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          {item.photo ? (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>🏥</Text>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>🏥</Text>
            </View>
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.centerName} numberOfLines={1}>
              {item.name || 'مركز طبي'}
            </Text>
            <Text style={styles.distance}>
              📍 {item.distance?.toFixed(1)} كم
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeText}>{badge.text}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.address} numberOfLines={1}>
            {item.address || 'العنوان غير متوفر'}
          </Text>
          {index === 0 && (
            <View style={styles.nearestBadge}>
              <Text style={styles.nearestText}>⭐ {t('results.nearest')}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('results.title')}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : providers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>{t('results.noResults')}</Text>
          <Text style={styles.emptyHint}>{t('results.farResult')}</Text>
        </View>
      ) : (
        <FlatList
          data={providers}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    marginBottom: 16,
  },
  backBtn: {
    ...FONTS.regular,
    color: COLORS.primary,
    fontSize: 16,
  },
  title: {
    ...FONTS.title,
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    ...FONTS.title,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusLarge,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  photoIcon: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  centerName: {
    ...FONTS.bold,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 4,
  },
  distance: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
  nearestBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nearestText: {
    fontSize: 11,
    color: '#92400E',
  },
});
