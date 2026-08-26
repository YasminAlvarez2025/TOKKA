import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from 'firebase/auth'
import { deleteApp, initializeApp } from 'firebase/app'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseConfig } from './firebase'

export const bootstrapAdminEmail = 'barracadofabio@tokkafoods.com.br'

export function watchAdminSession(restaurantId, onChange) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      onChange({ loading: false, user: null, isAdmin: false, error: '' })
      return
    }

    try {
      const adminRef = doc(db, 'restaurants', restaurantId, 'admins', user.uid)
      let adminSnapshot = await getDoc(adminRef)

      if (!adminSnapshot.exists() && user.email === bootstrapAdminEmail) {
        await setDoc(adminRef, {
          email: user.email,
          username: user.displayName || 'Administrador',
          role: 'owner',
          createdAt: serverTimestamp(),
        })

        adminSnapshot = await getDoc(adminRef)
      }

      onChange({
        loading: false,
        user,
        isAdmin: adminSnapshot.exists(),
        error: adminSnapshot.exists() ? '' : 'Conta sem permissao administrativa.',
      })
    } catch (error) {
      onChange({
        loading: false,
        user,
        isAdmin: false,
        error: translateAdminAuthError(error),
      })
    }
  })
}

export function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password)
}

export async function registerAdmin(restaurantId, { username, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = username.trim()
  const role = normalizedEmail === bootstrapAdminEmail ? 'owner' : 'admin'
  let credential

  try {
    credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password)
  } catch (error) {
    if (error?.code !== 'auth/email-already-in-use') {
      throw error
    }

    credential = await signInWithEmailAndPassword(auth, normalizedEmail, password)
  }

  if (normalizedUsername) {
    await updateProfile(credential.user, { displayName: normalizedUsername })
  }

  const adminRef = doc(db, 'restaurants', restaurantId, 'admins', credential.user.uid)
  const adminSnapshot = await getDoc(adminRef)

  if (adminSnapshot.exists()) {
    return credential
  }

  await setDoc(adminRef, {
    email: normalizedEmail,
    username: normalizedUsername,
    role,
    createdAt: serverTimestamp(),
  })

  return credential
}

export function recoverAdminPassword(email) {
  return sendPasswordResetEmail(auth, email.trim(), {
    url: `${window.location.origin}${window.location.pathname}#admin-principal`,
  })
}

export function logoutAdmin() {
  return signOut(auth)
}

export async function changeAdminCredentials(restaurantId, { currentPassword, email, password }) {
  const user = auth.currentUser
  if (!user?.email) throw new Error('auth/user-not-found')

  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword))

  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail && normalizedEmail !== user.email) await updateEmail(user, normalizedEmail)
  if (password) await updatePassword(user, password)

  await setDoc(doc(db, 'restaurants', restaurantId, 'admins', user.uid), {
    email: normalizedEmail || user.email,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function createRestaurantWithAdmin({ ownerRestaurantId, name, slug, adminName, email, password, menuState }) {
  const secondaryApp = initializeApp(firebaseConfig, `restaurant-admin-${Date.now()}`)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email.trim().toLowerCase(), password)
    if (adminName.trim()) await updateProfile(credential.user, { displayName: adminName.trim() })

    await setDoc(doc(db, 'restaurants', slug), {
      name: name.trim(),
      slug,
      active: true,
      createdBy: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    })
    await setDoc(doc(db, 'restaurants', slug, 'admins', credential.user.uid), {
      email: email.trim().toLowerCase(),
      username: adminName.trim(),
      role: 'owner',
      createdAt: serverTimestamp(),
    })
    await setDoc(doc(db, 'menuDirectory', slug), {
      restaurantId: slug,
      active: true,
      createdAt: serverTimestamp(),
    })
    await setDoc(doc(db, 'restaurants', slug, 'settings', 'menus', 'items', slug), {
      ...menuState,
      slug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { restaurantId: slug, user: credential.user, ownerRestaurantId }
  } finally {
    await signOut(secondaryAuth).catch(() => {})
    await deleteApp(secondaryApp)
  }
}

export function translateAdminAuthError(error) {
  const code = error?.code ?? ''

  if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) {
    return 'Email ou senha incorretos.'
  }

  if (code.includes('auth/user-not-found')) {
    return 'Conta administrativa nao encontrada.'
  }

  if (code.includes('auth/email-already-in-use')) {
    return 'Este email ja possui uma conta administrativa.'
  }

  if (code.includes('auth/weak-password')) {
    return 'Use uma senha com pelo menos 6 caracteres.'
  }

  if (code.includes('auth/invalid-email')) {
    return 'Informe um email valido.'
  }

  if (code.includes('auth/missing-password')) {
    return 'Informe a senha para continuar.'
  }

  if (code.includes('auth/too-many-requests')) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
  }

  if (code.includes('auth/requires-recent-login')) {
    return 'Confirme sua senha atual para alterar os dados de acesso.'
  }

  if (code.includes('permission-denied')) {
    return 'Conta criada, mas o perfil administrativo nao foi liberado pelas regras do Firebase.'
  }

  return 'Nao foi possivel entrar agora. Verifique a conexao e tente novamente.'
}
