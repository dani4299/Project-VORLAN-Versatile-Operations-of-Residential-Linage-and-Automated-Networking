import { inventory as seedInventory } from '../data/mockData'

export const INVENTORY_KEY = 'vorlan_inventory'

export function loadInventory() {
  const stored = localStorage.getItem(INVENTORY_KEY)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(seedInventory))
  return seedInventory
}

export function saveInventory(rows) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(rows))
}
