import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Localization } from 'expo-localization';

const resources = {
  ar: {
    translation: {
      app: {
        name: 'الحقونا',
        tagline: 'لأن كل ثانية مهمة'
      },
      home: {
        title: 'ماذا تحتاج؟',
        icu: 'عناية مركزة',
        incubator: 'حضانة أطفال',
        radiation: 'أشعة',
        search: 'ابحث عن الخدمة الأقرب'
      },
      results: {
        title: 'المراكز القريبة',
        noResults: 'لا توجد مراكز قريبة',
        nearest: 'الأقرب إليك',
        farResult: 'أقرب نتيجة حتى لو بعيدة',
        free: 'مجاني',
        discount: 'خصم {{percent}}%'
      },
      center: {
        call: 'اتصل الآن',
        hotline: 'الخط الساخن',
        openMap: 'افتح الخريطة',
        address: 'العنوان',
        services: 'الخدمات المتوفرة'
      },
      thankYou: {
        title: 'شكراً لاستخدامك الحقونا',
        message: 'نتمنى السلامة لمن تحب',
        backHome: 'العودة للرئيسية'
      },
      auth: {
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        centerName: 'اسم المركز',
        phone: 'رقم الهاتف',
        hotline: 'الخط الساخن',
        address: 'العنوان',
        forgotPassword: 'نسيت كلمة المرور؟'
      },
      provider: {
        setup: 'إعداد المركز',
        addPhoto: 'أضف صورة المركز',
        location: 'حدد الموقع',
        locationHint: 'قف أمام باب المركز واضغط على الزر',
        save: 'حفظ',
        dashboard: 'لوحة التحكم'
      },
      services: {
        icu: 'عناية مركزة',
        incubator: 'حضانة أطفال',
        radiation: 'أشعة',
        available: 'متاح',
        closed: 'مغلق',
        discount: 'نسبة الخصم',
        reminder: 'هل لا تزال ممتلئة؟'
      },
      common: {
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        retry: 'إعادة المحاولة',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        save: 'حفظ',
        back: 'رجوع'
      }
    }
  },
  en: {
    translation: {
      app: {
        name: 'El-Haquna',
        tagline: 'Because every second matters'
      },
      home: {
        title: 'What do you need?',
        icu: 'ICU',
        incubator: 'Incubator',
        radiation: 'Radiation',
        search: 'Find nearest service'
      },
      results: {
        title: 'Nearby Centers',
        noResults: 'No nearby centers found',
        nearest: 'Nearest to you',
        farResult: 'Nearest result even if far',
        free: 'FREE',
        discount: '{{percent}}% OFF'
      },
      center: {
        call: 'Call Now',
        hotline: 'Hotline',
        openMap: 'Open Map',
        address: 'Address',
        services: 'Available Services'
      },
      thankYou: {
        title: 'Thank you for using El-Haquna',
        message: 'We wish safety for your loved ones',
        backHome: 'Back to Home'
      },
      auth: {
        login: 'Login',
        register: 'Create Account',
        email: 'Email',
        password: 'Password',
        centerName: 'Center Name',
        phone: 'Phone Number',
        hotline: 'Hotline',
        address: 'Address',
        forgotPassword: 'Forgot password?'
      },
      provider: {
        setup: 'Center Setup',
        addPhoto: 'Add center photo',
        location: 'Set Location',
        locationHint: 'Stand at the center door and press the button',
        save: 'Save',
        dashboard: 'Dashboard'
      },
      services: {
        icu: 'ICU',
        incubator: 'Incubator',
        radiation: 'Radiation',
        available: 'Available',
        closed: 'Closed',
        discount: 'Discount Rate',
        reminder: 'Is it still full?'
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Retry',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        back: 'Back'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale?.startsWith('ar') ? 'ar' : 'en',
  fallbackLng: 'ar',
  interpolation: { escapeValue: false }
});

export default i18n;
