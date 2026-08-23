import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, firebaseEnabled } from './firebase'

const menuStoragePrefix = 'food99like-menu-state'

export function readCachedMenuState(restaurantId, slug) {
  if (typeof window === 'undefined' || !slug) return null

  try {
    const rawValue = window.localStorage?.getItem(getMenuStateKey(restaurantId, slug))
    return rawValue ? JSON.parse(rawValue) : null
  } catch {
    return null
  }
}

export async function loadMenuState(restaurantId, slug) {
  if (!slug) return null

  const cachedState = readCachedMenuState(restaurantId, slug)

  if (!firebaseEnabled) {
    return cachedState
  }

  try {
    const menuRef = getMenuStateRef(restaurantId, slug)
    const menuSnapshot = await getDoc(menuRef)

    if (menuSnapshot.exists()) {
      const remoteState = menuSnapshot.data()
      cacheMenuState(restaurantId, slug, remoteState)
      return remoteState
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Menu state was loaded from local cache.', error)
    }
  }

  return cachedState
}

export async function saveMenuState(restaurantId, slug, menuState, { remote = true } = {}) {
  if (!slug || !menuState) return

  const nextState = {
    ...menuState,
    slug,
    clientUpdatedAt: new Date().toISOString(),
  }

  cacheMenuState(restaurantId, slug, nextState)

  if (!remote || !firebaseEnabled) return

  try {
    await setDoc(
      getMenuStateRef(restaurantId, slug),
      {
        ...nextState,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Menu state was saved only in local cache.', error)
    }
  }
}

function cacheMenuState(restaurantId, slug, menuState) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage?.setItem(getMenuStateKey(restaurantId, slug), JSON.stringify(menuState))
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Menu state cache failed.', error)
    }
  }
}

function getMenuStateRef(restaurantId, slug) {
  return doc(db, 'restaurants', restaurantId, 'settings', 'menus', 'items', slug)
}

function getMenuStateKey(restaurantId, slug) {
  return `${menuStoragePrefix}:${restaurantId}:${slug}`
}
