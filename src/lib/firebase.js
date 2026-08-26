import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const env = import.meta.env

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyBIYG6d79B_puvRCBUB_38vus6ZbyGCi_k',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'tokka-eb4ae.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'tokka-eb4ae',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'tokka-eb4ae.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '760545643115',
  appId: env.VITE_FIREBASE_APP_ID || '1:760545643115:web:ee2225650bed8bf2d0bf2e',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-2QG8D1HY1S',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
})
export const storage = getStorage(firebaseApp)

export const analyticsPromise =
  typeof window === 'undefined'
    ? Promise.resolve(null)
    : isAnalyticsSupported()
        .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
        .catch(() => null)

export const firebaseEnabled = env.VITE_FIREBASE_ENABLED !== 'false'
