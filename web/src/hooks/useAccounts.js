import { useState, useCallback } from 'react'

const STORAGE_KEY = 'higgsfield_accounts'
const ACTIVE_KEY = 'higgsfield_active'

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function useAccounts() {
  const [accounts, setAccounts] = useState(loadAccounts)
  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_KEY) || null)

  const save = useCallback((list) => {
    setAccounts(list)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }, [])

  const addAccount = useCallback((name, apiKey) => {
    const id = crypto.randomUUID()
    const updated = [...accounts, { id, name, apiKey }]
    save(updated)
    if (updated.length === 1) {
      setActiveId(id)
      localStorage.setItem(ACTIVE_KEY, id)
    }
    return id
  }, [accounts, save])

  const removeAccount = useCallback((id) => {
    const updated = accounts.filter(a => a.id !== id)
    save(updated)
    if (activeId === id) {
      const next = updated[0]?.id || null
      setActiveId(next)
      if (next) localStorage.setItem(ACTIVE_KEY, next)
      else localStorage.removeItem(ACTIVE_KEY)
    }
  }, [accounts, activeId, save])

  const selectAccount = useCallback((id) => {
    setActiveId(id)
    localStorage.setItem(ACTIVE_KEY, id)
  }, [])

  const activeAccount = accounts.find(a => a.id === activeId) || null

  return { accounts, activeAccount, addAccount, removeAccount, selectAccount }
}
