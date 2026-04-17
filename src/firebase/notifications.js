import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { messaging, db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;

/**
 * Init FCM + store token in staff
 */
export async function initNotifications(staffId = "staff_01") {
  try {
    const supported = await isSupported();
    if (!supported || !messaging) {
      console.warn('[FCM] Not supported.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FCM] Permission denied.');
      return null;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (token) {
      console.log('[FCM] Token:', token);

      // ✅ Save token to Firestore
      await updateDoc(doc(db, "staff", staffId), {
        fcmToken: token
      });

      return token;
    }

    return null;
  } catch (err) {
    console.error('[FCM] Error:', err);
    return null;
  }
}

/**
 * Foreground notifications
 */
export function listenForegroundMessages(callback) {
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    callback({
      title: payload.notification?.title || 'RESPOND Alert',
      body: payload.notification?.body || 'New incident',
      data: payload.data || {}
    });
  });
}