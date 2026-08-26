import { deleteApp, initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, initializeFirestore, serverTimestamp, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBIYG6d79B_puvRCBUB_38vus6ZbyGCi_k',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'tokka-eb4ae.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'tokka-eb4ae',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'tokka-eb4ae.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '760545643115',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:760545643115:web:ee2225650bed8bf2d0bf2e',
}

const ownerEmail = process.env.FIREBASE_OWNER_EMAIL
const ownerPassword = process.env.FIREBASE_OWNER_PASSWORD
const restaurantName = process.env.FIREBASE_NEW_RESTAURANT_NAME
const restaurantSlug = process.env.FIREBASE_NEW_RESTAURANT_SLUG
const adminEmail = process.env.FIREBASE_NEW_ADMIN_EMAIL
const adminPassword = process.env.FIREBASE_NEW_ADMIN_PASSWORD

if (![ownerEmail, ownerPassword, restaurantName, restaurantSlug, adminEmail, adminPassword].every(Boolean)) {
  throw new Error('Informe as variáveis do proprietário e do novo restaurante.')
}

const ownerApp = initializeApp(firebaseConfig, 'restaurant-owner')
const adminApp = initializeApp(firebaseConfig, 'restaurant-new-admin')
const ownerAuth = getAuth(ownerApp)
const adminAuth = getAuth(adminApp)
const db = initializeFirestore(ownerApp, { ignoreUndefinedProperties: true })

try {
  await signInWithEmailAndPassword(ownerAuth, ownerEmail, ownerPassword)

  let adminCredential
  try {
    adminCredential = await createUserWithEmailAndPassword(adminAuth, adminEmail, adminPassword)
  } catch (error) {
    if (error?.code !== 'auth/email-already-in-use') throw error
    adminCredential = await signInWithEmailAndPassword(adminAuth, adminEmail, adminPassword)
  }

  await setDoc(doc(db, 'restaurants', restaurantSlug), {
    name: restaurantName,
    slug: restaurantSlug,
    active: true,
    createdBy: ownerAuth.currentUser.uid,
    createdAt: serverTimestamp(),
  }, { merge: true })

  await setDoc(doc(db, 'restaurants', restaurantSlug, 'admins', adminCredential.user.uid), {
    email: adminEmail,
    username: 'Administrador',
    role: 'owner',
    createdAt: serverTimestamp(),
  }, { merge: true })

  await setDoc(doc(db, 'menuDirectory', restaurantSlug), {
    restaurantId: restaurantSlug,
    active: true,
    createdAt: serverTimestamp(),
  }, { merge: true })

  await setDoc(doc(db, 'restaurants', restaurantSlug, 'settings', 'menus', 'items', restaurantSlug), {
    version: 1,
    slug: restaurantSlug,
    profile: {
      name: restaurantName,
      location: 'Atualize a localização',
      slug: restaurantSlug,
      theme: { primary: '#4b160e', accent: '#d8ad61', surface: '#ffffff' },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true })

  console.log(`Restaurante criado: ${restaurantName}`)
  console.log(`Link: https://tokka-eb4ae.web.app/#cardapio-${restaurantSlug}`)
  console.log(`Administrador vinculado: ${adminEmail}`)
} finally {
  await signOut(ownerAuth).catch(() => {})
  await signOut(adminAuth).catch(() => {})
  await deleteApp(ownerApp)
  await deleteApp(adminApp)
}
