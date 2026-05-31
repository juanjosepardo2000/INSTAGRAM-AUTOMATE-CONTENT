import { useState, useEffect } from 'react'
import { useHiggsfield } from '../hooks/useHiggsfield'

function AccountRow({ account, isActive, onSelect, onRemove }) {
  const { credits, checkBalance } = useHiggsfield(account.apiKey)

  useEffect(() => {
    checkBalance()
  }, [checkBalance])

  return (
    <div
      className={`account-row ${isActive ? 'account-row--active' : ''}`}
      onClick={() => onSelect(account.id)}
    >
      <div className="account-info">
        <span className="account-name">{account.name}</span>
        <span className="account-credits">
          {credits === null ? '...' : `${credits} credits`}
        </span>
      </div>
      <button
        className="btn-remove"
        onClick={e => { e.stopPropagation(); onRemove(account.id) }}
        title="Remove account"
      >
        ×
      </button>
    </div>
  )
}

export default function AccountsPanel({ accounts, activeAccount, onAdd, onRemove, onSelect }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [adding, setAdding] = useState(false)

  function handleAdd(e) {
    e.preventDefault()
    if (!name.trim() || !key.trim()) return
    onAdd(name.trim(), key.trim())
    setName('')
    setKey('')
    setAdding(false)
  }

  return (
    <div className="accounts-panel">
      <button className="accounts-toggle" onClick={() => setOpen(o => !o)}>
        <span className="accounts-icon">⚡</span>
        <span>
          {activeAccount ? activeAccount.name : 'No Higgsfield account'}
        </span>
        <span className="accounts-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="accounts-dropdown">
          <div className="accounts-label">Higgsfield Accounts</div>

          {accounts.length === 0 && (
            <div className="accounts-empty">No accounts yet. Add one below.</div>
          )}

          {accounts.map(account => (
            <AccountRow
              key={account.id}
              account={account}
              isActive={activeAccount?.id === account.id}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}

          {adding ? (
            <form className="account-form" onSubmit={handleAdd}>
              <input
                className="account-input"
                placeholder="Account name (e.g. Personal)"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
              <input
                className="account-input"
                placeholder="API Key"
                value={key}
                onChange={e => setKey(e.target.value)}
                type="password"
              />
              <div className="account-form-actions">
                <button type="submit" className="btn-add-confirm">Add</button>
                <button type="button" className="btn-cancel" onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="btn-add-account" onClick={() => setAdding(true)}>
              + Add account
            </button>
          )}
        </div>
      )}
    </div>
  )
}
