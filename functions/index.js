const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Scheduled function: sends reminder every 6 hours to providers
 * who have closed services, asking "هل لا تزال ممتلئة؟"
 */
exports.sendServiceReminders = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async (context) => {
    const providersSnap = await db.collection('providers').get();

    const notifications = [];

    providersSnap.forEach((doc) => {
      const provider = doc.data();
      const fcmToken = provider.fcmToken;
      if (!fcmToken) return;

      const services = provider.services || {};
      const closedServices = Object.entries(services)
        .filter(([key, val]) => !val.available)
        .map(([key]) => key);

      if (closedServices.length > 0) {
        const serviceNames = closedServices.map(s => {
          if (s === 'icu') return 'العناية المركزة';
          if (s === 'incubator') return 'الحضانة';
          if (s === 'radiation') return 'الأشعة';
          return s;
        }).join('، ');

        notifications.push(
          messaging.send({
            token: fcmToken,
            notification: {
              title: 'هل لا تزال ممتلئة؟',
              body: `${serviceNames} - هل يمكن فتحها للمحتاجين؟`,
            },
            data: {
              type: 'service_reminder',
              closedServices: closedServices.join(','),
            },
          }).catch(err => {
            console.error(`Failed to send to ${doc.id}:`, err.message);
          })
        );
      }
    });

    await Promise.all(notifications);
    console.log(`Sent ${notifications.length} reminder notifications`);
    return null;
  });

/**
 * Callable function: update FCM token for a provider
 */
exports.updateFcmToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'يجب تسجيل الدخول');
  }

  const { token } = data;
  if (!token) {
    throw new functions.https.HttpsError('invalid-argument', 'Token required');
  }

  await db.collection('providers').doc(context.auth.uid).update({
    fcmToken: token,
    fcmTokenUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});
