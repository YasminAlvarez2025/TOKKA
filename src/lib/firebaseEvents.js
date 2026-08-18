import { logEvent } from 'firebase/analytics'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { analyticsPromise, db, firebaseEnabled } from './firebase'

export async function persistAnalyticsEvent(event) {
  if (!firebaseEnabled || !event?.restaurantId) return

  const firestoreEvent = compactObject({
    ...sanitizeEventPayload(event),
    createdAt: serverTimestamp(),
    clientCreatedAt: event.createdAt,
  })

  const analyticsTask = analyticsPromise.then((analytics) => {
    if (!analytics) return null

    logEvent(analytics, event.event, sanitizeAnalyticsPayload(event))
    return null
  })

  const firestoreTask = addDoc(
    collection(db, 'restaurants', event.restaurantId, 'events'),
    firestoreEvent,
  )

  const results = await Promise.allSettled([analyticsTask, firestoreTask])

  if (import.meta.env.DEV && results.every((result) => result.status === 'rejected')) {
    console.warn('Firebase event was not persisted.', results)
  }
}

export async function persistOrder(order) {
  if (!firebaseEnabled || !order?.restaurantId || !order?.id) return

  const orderRef = doc(db, 'restaurants', order.restaurantId, 'orders', order.id)

  try {
    await setDoc(orderRef, compactObject({
      ...order,
      createdAt: serverTimestamp(),
    }))
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Firebase order was not persisted.', error)
    }
  }
}

function sanitizeEventPayload(event) {
  return compactObject({
    id: event.id,
    event: event.event,
    restaurantId: event.restaurantId,
    sessionId: event.sessionId,
    cardId: event.cardId,
    source: event.source,
    language: event.language,
    tableNumber: event.tableNumber,
    productId: event.productId,
    productName: event.productName,
    category: event.category,
    quantity: event.quantity,
    hasNote: event.hasNote,
    optionId: event.optionId,
    url: event.url,
    command: event.command,
    searchQuery: event.searchQuery,
    resultCount: event.resultCount,
    serviceType: event.serviceType,
    paymentType: event.paymentType,
    hasCustomerName: event.hasCustomerName,
    cartQuantity: event.cartQuantity,
    cartTotal: event.cartTotal,
    orderId: event.orderId,
  })
}

function sanitizeAnalyticsPayload(event) {
  return Object.fromEntries(
    Object.entries(sanitizeEventPayload(event))
      .filter(([key, value]) => (
        key !== 'event' &&
        key !== 'id' &&
        ['string', 'number', 'boolean'].includes(typeof value)
      )),
  )
}

function compactObject(value) {
  if (Array.isArray(value)) {
    return value.map((item) => compactObject(item))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, compactObject(entryValue)]),
  )
}
