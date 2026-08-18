import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export const bootstrapAdminEmail = 'admin@tokkafoods.com.br'

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

export function logoutAdmin() {
  return signOut(auth)
}

export function translateAdminAuthError(error) {
  const code = error?.code ?? ''

  if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) {
    return 'Email ou senha incorretos.'
  }

  if (code.includes('auth/user-not-found')) {
    return 'Conta administrativa nao encontrada.'
  }

  if (code.includes('auth/too-many-requests')) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
  }

  if (code.includes('permission-denied')) {
    return 'Conta autenticada, mas sem permissao administrativa.'
  }

  return 'Nao foi possivel entrar agora. Verifique a conexao e tente novamente.'
}
