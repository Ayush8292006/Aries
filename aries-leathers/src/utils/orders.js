import { readJSON, writeJSON } from './storage'

const ORDERS_KEY = 'aries_orders'
const DRAFT_KEY = 'aries_checkout_draft'

// ===== Orders (frontend demo — localStorage) =====
export function getOrders() {
  return readJSON(ORDERS_KEY, [])
}

export function getUserOrders(userId) {
  return getOrders()
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getOrder(id) {
  return getOrders().find((o) => o.id === id) ?? null
}

export function saveOrder(order) {
  writeJSON(ORDERS_KEY, [order, ...getOrders()])
  return order
}

export function generateOrderId() {
  const time = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `AL-${time}-${rand}`
}

// ===== Checkout draft (address + delivery) — sirf is tab ke liye =====
export function readDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY))
  } catch {
    return null
  }
}

export function saveDraft(draft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    /* storage unavailable */
  }
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function updateOrderStatus(id, status) {
  const updated = getOrders().map((o) => (o.id === id ? { ...o, status } : o))
  writeJSON(ORDERS_KEY, updated)
  return updated
}