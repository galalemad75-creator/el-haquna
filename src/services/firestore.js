import { db, auth } from '../config/firebase';
import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, where, orderBy, limit, GeoPoint
} from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Calculate distance between two GeoPoints (Haversine formula)
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// --- Auth ---
export async function loginProvider(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerProvider(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// --- Providers ---
export async function createProvider(data) {
  return addDoc(collection(db, 'providers'), {
    ...data,
    createdAt: new Date(),
    services: {
      icu: { available: false, discount: 0 },
      incubator: { available: false, discount: 0 },
      radiation: { available: false, discount: 0 },
    }
  });
}

export async function updateProvider(providerId, data) {
  return updateDoc(doc(db, 'providers', providerId), data);
}

export async function updateProviderService(providerId, serviceType, serviceData) {
  return updateDoc(doc(db, 'providers', providerId), {
    [`services.${serviceType}`]: serviceData
  });
}

export async function getProvidersByService(serviceType, userLat, userLon) {
  // Fetch all providers where the service is available
  const q = query(
    collection(db, 'providers'),
    where(`services.${serviceType}.available`, '==', true)
  );
  const snapshot = await getDocs(q);
  const results = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const lat = data.location?.latitude || 0;
    const lon = data.location?.longitude || 0;
    const distance = getDistanceKm(userLat, userLon, lat, lon);
    results.push({ id: docSnap.id, ...data, distance });
  });
  results.sort((a, b) => a.distance - b.distance);
  return results;
}

export async function getAllProviders() {
  const snapshot = await getDocs(collection(db, 'providers'));
  const results = [];
  snapshot.forEach(docSnap => {
    results.push({ id: docSnap.id, ...docSnap.data() });
  });
  return results;
}

// Cloud Function: send reminder notification (called via HTTPS callable)
export async function sendReminderNotification(providerId) {
  // This would call a Firebase Cloud Function
  // For now, just log
  console.log('Sending reminder to provider:', providerId);
}
