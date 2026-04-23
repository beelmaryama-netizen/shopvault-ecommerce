import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000/api'
const CAT_COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4']
const CAT_ICONS  = ['🖥️','📱','👗','🏠','🎮','📚']

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editItem, setEditItem]     = useState(null)
  const [name, setName]             = useState('')
  const [toast, setToast]           = useState(null)
  const [deleteId, setDeleteId]     = useState(null)
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: token }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/categories`, { headers })
      setCategories(res.data)
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/login') }
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openAdd  = () => { setEditItem(null); setName(''); setShowModal(true) }
  const openEdit = (c) => { setEditItem(c); setName(c.name); setShowModal(true) }

  const handleSave = async () => {
    if (editItem) {
      await axios.put(`${API}/categories/${editItem.id}`, { name }, { headers })
    } else {
      await axios.post(`${API}/categories`, { name }, { headers })
    }
    setShowModal(false)
    showToast(editItem ? 'Catégorie modifiée ✅' : 'Catégorie ajoutée ✅')
    fetchAll()
  }

  const handleDelete = async () => {
    await axios.delete(`${API}/categories/${deleteId}`, { headers })
    setDeleteId(null)
    showToast('Catégorie supprimée 🗑️', 'error')
    fetchAll()
  }

  return (
    <div className="page-container">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
      <div className="page-header">
        <div>
          <h1 className="page-title">Catégories</h1>
          <p className="page-sub">{categories.length} catégorie{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Nouvelle catégorie</button>
      </div>

      {loading ? (
        <div className="cat-grid">{[1,2,3,4].map(i => <div key={i} className="skeleton-cat" />)}</div>
      ) : categories.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">🗂️</span><p>Aucune catégorie</p></div>
      ) : (
        <div className="cat-grid">
          {categories.map((c, i) => (
            <div key={c.id} className="cat-card" style={{ '--cat-color': CAT_COLORS[i % CAT_COLORS.length] }}>
              <div className="cat-icon">{CAT_ICONS[i % CAT_ICONS.length]}</div>
              <div className="cat-body">
                <h3 className="cat-name">{c.name}</h3>
                <span className="cat-id">ID #{c.id}</span>
              </div>
              <div className="cat-actions">
                <button className="btn-edit" onClick={() => openEdit(c)}>✏️</button>
                <button className="btn-delete" onClick={() => setDeleteId(c.id)}>🗑️</button>
              </div>
              <div className="cat-accent" />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? 'Modifier' : 'Nouvelle catégorie'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom</label>
                <input className="modal-input" value={name}
                  onChange={e => setName(e.target.value)} placeholder="Ex: Électronique" autoFocus />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-primary" onClick={handleSave} disabled={!name.trim()}>
                {editItem ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Supprimer ?</h2></div>
            <div className="modal-body"><p>Les produits liés pourraient être affectés.</p></div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Annuler</button>
              <button className="btn-danger" onClick={handleDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}