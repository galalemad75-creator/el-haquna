# 🏥 الحقونا (El-Haquna)

تطبيق مجاني يربط المحتاج لخدمة طبية (عناية مركزة / حضانة مولود / أشعة) بأقرب مركز يقدمها مجاناً أو بخصم 50% فأكثر — بدون تسجيل وبضغطة واحدة.

**لأن كل ثانية مهمة.**

---

## 📱 الشاشات

| # | الشاشة | الوصف |
|---|--------|-------|
| 1 | Splash Screen | شاشة الترحيب مع الأنيميشن |
| 2 | Home | 3 أيقونات كبيرة (عناية مركزة / حضانة / أشعة) |
| 3 | Results | قائمة المراكز مرتبة بالأقرب |
| 4 | Center Details | صورة + خصم + هاتف + خريطة |
| 5 | Thank You | شكر + إعلان AdMob |
| 6 | Login | تسجيل دخول المراكز |
| 7 | Register | إنشاء حساب مركز |
| 8 | Provider Setup | بيانات المركز + صورة + عنوان |
| 9 | Location Capture | تعليمات GPS لتحديد الموقع |
| 10 | Dashboard | فتح/إغلاق الخدمات + نسبة الخصم |

---

## 🔧 التقنيات

- **Expo React Native** (SDK 52)
- **Firebase** (Firestore + Auth + Storage + Cloud Messaging)
- **expo-location** للـ GPS
- **i18next** للترجمة (عربي/إنجليزي)
- **React Navigation** للتنقل

---

## 🚀 التشغيل

### 1. تثبيت المتطلبات
```bash
cd el-haquna
npm install
```

### 2. إعداد Firebase
1. أنشئ مشروع Firebase على [console.firebase.google.com](https://console.firebase.google.com)
2. أضف تطبيق Android/iOS
3. انسخ الـ config إلى `src/config/firebase.js`
4. فعّل Firestore و Authentication (Email/Password)
5. ارفع قواعد الأمان:
```bash
firebase deploy --only firestore:rules
```

### 3. تشغيل التطبيق
```bash
npx expo start
```

---

## 🗄️ قاعدة البيانات (Firestore)

### Collection: `providers`

```json
{
  "userId": "string (Firebase Auth UID)",
  "name": "string (اسم المركز)",
  "photo": "string (رابط الصورة)",
  "phone": "string (رقم الهاتف)",
  "hotline": "string (الخط الساخن)",
  "address": "string (العنوان)",
  "location": "GeoPoint (إحداثيات GPS)",
  "setupComplete": "boolean",
  "fcmToken": "string (إشعار Push)",
  "services": {
    "icu": { "available": true, "discount": 0 },
    "incubator": { "available": false, "discount": 50 },
    "radiation": { "available": true, "discount": 100 }
  }
}
```

### قواعد الخصم:
- `discount: 0` → مجاني (badge أخضر)
- `discount: 1-100` → خصم بال百分比 (badge أزرق)
- `available: false` → الخدمة مغلقة

---

## 🔔 نظام التنبيهات

دالة Cloud Function تعمل كل 6 ساعات:
- تتحقق من المراكز التي أغلقت خدماتها
- ترسل إشعار: **"هل لا تزال ممتلئة؟"**
- لتفعيلها:
```bash
cd functions
npm install
firebase deploy --only functions
```

---

## 🎨 التصميم

- **أزرق طبي:** `#1A73E8`
- **أخضر طوارئ:** `#00897B`
- **خلفية:** `#F8FAFB`
- **خط:** Cairo (عربي) / Roboto (إنجليزي)

---

## 📄 الترخيص

مشروع مفتوح المصدر لخدمة المجتمع.
