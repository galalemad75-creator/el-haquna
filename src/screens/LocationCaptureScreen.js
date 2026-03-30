import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { GeoPoint } from 'firebase/firestore';
import { updateProvider } from '../services/firestore';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function LocationCaptureScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { userId, address, photo } = route.params;
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [coords, setCoords] = useState(null);

  const captureLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'يجب السماح بالوصول للموقع');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCoords(location.coords);
      setCaptured(true);
    } catch (error) {
      Alert.alert(t('common.error'), 'فشل تحديد الموقع');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!coords) {
      Alert.alert(t('common.error'), 'يرجى تحديد الموقع أولاً');
      return;
    }
    setLoading(true);
    try {
      await updateProvider(userId, {
        address,
        photo,
        location: new GeoPoint(coords.latitude, coords.longitude),
        setupComplete: true,
      });
      navigation.replace('ProviderDashboard', { userId });
    } catch (error) {
      Alert.alert(t('common.error'), 'فشل حفظ البيانات');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('provider.location')}</Text>
      </View>

      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progress}>
          <View style={[styles.progressDot, styles.progressDone]} />
          <View style={[styles.progressLine, styles.progressLineActive]} />
          <View style={[styles.progressDot, styles.progressActive]} />
          <Text style={styles.progressText}>2 / 2</Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionIcon}>📍</Text>
          <Text style={styles.instructionText}>{t('provider.locationHint')}</Text>
        </View>

        {/* GPS Capture Button */}
        <TouchableOpacity
          style={[styles.captureBtn, captured && styles.captureBtnDone]}
          onPress={captureLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="large" />
          ) : (
            <>
              <Text style={styles.captureIcon}>{captured ? '✅' : '📡'}</Text>
              <Text style={styles.captureText}>
                {captured ? 'تم تحديد الموقع' : 'اضغط لتحديد الموقع'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Coordinates Display */}
        {coords && (
          <View style={styles.coordsCard}>
            <Text style={styles.coordsLabel}>الإحداثيات:</Text>
            <Text style={styles.coordsValue}>
              {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, !captured && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!captured || loading}
        >
          <Text style={styles.saveBtnText}>{t('common.save')}</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progress: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  progressActive: {
    backgroundColor: COLORS.primary,
  },
  progressDone: {
    backgroundColor: COLORS.secondary,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: COLORS.secondary,
  },
  progressText: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginRight: 12,
  },
  instructionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusLarge,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  instructionText: {
    ...FONTS.regular,
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  captureBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusLarge,
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  captureBtnDone: {
    backgroundColor: COLORS.secondary,
  },
  captureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  captureText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
  coordsCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  coordsLabel: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  coordsValue: {
    ...FONTS.bold,
    color: COLORS.text,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 18,
  },
});
