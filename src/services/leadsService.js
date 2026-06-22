/**
 * Lead management service.
 * In production, swap fetch() calls to your Firebase / Express backend.
 * Currently persists to localStorage for demo purposes.
 */

const STORAGE_KEY = 'clearview_leads'

export function saveLeadLocally(lead) {
  const leads = getLeads()
  const newLead = {
    ...lead,
    id:         Date.now().toString(),
    createdAt:  new Date().toISOString(),
    status:     'new',
  }
  leads.unshift(newLead)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  return newLead
}

export function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function updateLeadStatus(id, status) {
  const leads = getLeads().map(l => l.id === id ? { ...l, status } : l)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

export function deleteLead(id) {
  const leads = getLeads().filter(l => l.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

// Simulate async API call
export async function submitLead(formData) {
  await new Promise(r => setTimeout(r, 700)) // simulate network
  return saveLeadLocally(formData)
}
