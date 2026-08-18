import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyDKcC8S9JkN2hcVOvNjKd3zMCARmcMinuc',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'tokka-foods.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'tokka-foods',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'tokka-foods.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '810576160609',
  appId: env.VITE_FIREBASE_APP_ID || '1:810576160609:web:c759f9ac88496c187f4720',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-SCQEHM0EB1',
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
