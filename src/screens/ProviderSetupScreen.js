import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, Alert, ScrollView, Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { updateProvider } from '../services/firestore';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function ProviderSetupScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { userId } = route.params;
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (!address) {
      Alert.alert(t('common.error'), 'يرجى إدخال العنوان');
      return;
    }
    navigation.navigate('LocationCapture', {
      userId,
      address,
      photo,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('provider.setup')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progress}>
          <View style={[styles.progressDot, styles.progressActive]} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
          <Text style={styles.progressText}>1 / 2</Text>
        </View>

        {/* Photo */}
        <TouchableOpacity style={styles.photoSection} onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoText}>{t('provider.addPhoto')}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Address */}
        <Text style={styles.label}>{t('auth.address')}</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={address}
          onChangeText={setAddress}
          placeholder="العنوان التفصيلي للمركز..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          textAlign="right"
          textAlignVertical="top"
        />

        {/* Next Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>التالي: تحديد الموقع ←</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  progressText: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginRight: 12,
  },
  photoSection: {
    marginBottom: 24,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.borderRadiusLarge,
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.borderRadiusLarge,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  photoText: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
  },
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
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
});
