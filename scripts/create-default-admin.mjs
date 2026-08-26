import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  initializeFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBIYG6d79B_puvRCBUB_38vus6ZbyGCi_k',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'tokka-eb4ae.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'tokka-eb4ae',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'tokka-eb4ae.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '760545643115',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:760545643115:web:ee2225650bed8bf2d0bf2e',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-2QG8D1HY1S',
}

const restaurantId = process.env.FIREBASE_RESTAURANT_ID || 'tokka-foods'
const adminEmail = process.env.FIREBASE_ADMIN_EMAIL || 'barracadofabio@tokkafoods.com.br'
const adminPassword = process.env.FIREBASE_ADMIN_PASSWORD

if (!adminPassword) {
  console.error('Defina FIREBASE_ADMIN_PASSWORD antes de executar este script.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
})

let credential

try {
  credential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
  console.log(`Usuario admin criado: ${adminEmail}`)
} catch (error) {
  if (error?.code !== 'auth/email-already-in-use') {
    throw error
  }

  credential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
  console.log(`Usuario admin existente confirmado: ${adminEmail}`)
}

const adminRef = doc(db, 'restaurants', restaurantId, 'admins', credential.user.uid)
const adminSnapshot = await getDoc(adminRef)

if (adminSnapshot.exists()) {
  console.log(`Documento admin ja existe: restaurants/${restaurantId}/admins/${credential.user.uid}`)
  process.exit(0)
}

await setDoc(adminRef, {
  email: adminEmail,
  username: 'Administrador',
  role: 'owner',
  createdAt: serverTimestamp(),
})

console.log(`Documento admin gravado: restaurants/${restaurantId}/admins/${credential.user.uid}`)
process.exit(0)
