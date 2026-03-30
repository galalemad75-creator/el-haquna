import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Animated, Dimensions, Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { COLORS, FONTS, SIZES, SERVICE_ICONS } from '../constants/theme';

const { width } = Dimensions.get('window');

const SERVICES = [
  { key: 'icu', icon: '❤️', color: '#EF4444' },
  { key: 'incubator', icon: '👶', color: '#F59E0B' },
  { key: 'radiation', icon: '☢️', color: '#8B5CF6' },
];

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState(null);
  const bounceAnim = new Animated.Value(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    })();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -10, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleServicePress = (serviceKey) => {
    navigation.navigate('Results', {
      serviceType: serviceKey,
      userLocation,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginBtnText}>🏥 {t('auth.login')}</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.appName}>الحقونا</Text>
          <Text style={styles.tagline}>{t('app.tagline')}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{t('home.title')}</Text>

      {/* Service Icons - 3 Big Cards */}
      <ScrollView contentContainerStyle={styles.servicesContainer}>
        {SERVICES.map((service, index) => (
          <TouchableOpacity
            key={service.key}
            style={[styles.serviceCard, { borderLeftColor: service.color }]}
            onPress={() => handleServicePress(service.key)}
            activeOpacity={0.7}
          >
            <Animated.Text
              style={[
                styles.serviceIcon,
                { transform: [{ translateY: bounceAnim }] }
              ]}
            >
              {service.icon}
            </Animated.Text>
            <Text style={styles.serviceName}>{t(`home.${service.key}`)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Location Status */}
      <View style={styles.locationStatus}>
        <Text style={styles.locationText}>
          {userLocation ? '📍 تم تحديد موقعك' : '📍 جاري تحديد الموقع...'}
        </Text>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.borderRadius,
  },
  loginBtnText: {
    color: COLORS.white,
    ...FONTS.regular,
    fontSize: 14,
  },
  headerCenter: {
    alignItems: 'flex-end',
  },
  appName: {
    ...FONTS.title,
    color: COLORS.primary,
    fontSize: 28,
  },
  tagline: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 26,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusLarge,
    padding: 24,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderLeftWidth: 5,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  serviceIcon: {
    fontSize: SIZES.iconLarge,
    marginLeft: 20,
  },
  serviceName: {
    ...FONTS.title,
    color: COLORS.text,
    fontSize: 24,
    flex: 1,
    textAlign: 'right',
  },
  locationStatus: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  locationText: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});
