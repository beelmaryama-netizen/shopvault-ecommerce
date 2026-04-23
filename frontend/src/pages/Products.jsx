import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../utils/cart'

const API = 'http://localhost:3000/api'

const PRODUCT_IMAGES = {
  ordinateur: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  dell: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&q=80',
  clavier: 'https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=400&q=80',
  souris: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
  écran: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  ssd: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=400&q=80',
  disque: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=400&q=80',
  iphone: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80',
  samsung: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
  chargeur: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
  écouteurs: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  coque: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'
}

function getImage(name) {
  if (!name) return PRODUCT_IMAGES.default
  const lower = name.toLowerCase()

  for (const [key, url] of Object.entries(PRODUCT_IMAGES)) {
    if (lower.includes(key)) return url
  }

  return PRODUCT_IMAGES.default
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', category_id: '' })
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pRes, cRes] = await Promise.all([
        axios.get(`${API}/products`, { headers }),
        axios.get(`${API}/categories`, { headers })
      ])

      setProducts(pRes.data)
      setCategories(cRes.data)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: '', price: '', category_id: categories[0]?.id || '' })
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditItem(p)
    setForm({ name: p.name, price: p.price, category_id: p.category_id })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (!form.name || !form.price || !form.category_id) {
        showToast('Veuillez remplir tous les champs', 'error')
        return
      }

      if (editItem) {
        await axios.put(`${API}/products/${editItem.id}`, form, { headers })
      } else {
        await axios.post(`${API}/products`, form, { headers })
      }

      setShowModal(false)
      showToast(editItem ? 'Produit modifié ✅' : 'Produit ajouté ✅')
      fetchAll()
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/products/${deleteId}`, { headers })
      setDeleteId(null)
      showToast('Produit supprimé 🗑️', 'error')
      fetchAll()
    } catch {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    showToast('Produit ajouté au panier 🛒')
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? String(p.category_id) === String(filterCat) : true
    return matchSearch && matchCat
  })

  return (
    <div className="page-container">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Produits</h1>
          <p className="page-sub">
            {products.length} produit{products.length !== 1 ? 's' : ''} dans la boutique
          </p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          + Ajouter un produit
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="products-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="products-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <p>Aucun produit trouvé</p>
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-img-wrap">
                  <img src={getImage(p.name)} alt={p.name} className="product-img" />
                  <span className="product-badge">{p.category}</span>
                </div>

                <div className="product-body">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-price">{Number(p.price).toFixed(2)} $</p>

                  <div className="product-actions">
                    <button className="btn-edit" onClick={() => openEdit(p)}>
                      ✏️ Modifier
                    </button>

                    <button className="btn-cart" onClick={() => handleAddToCart(p)}>
                      🛒 Ajouter
                    </button>

                    <button className="btn-delete" onClick={() => setDeleteId(p.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nom</label>
                <input
                  className="modal-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: iPhone 15"
                />
              </div>

              <div className="form-group">
                <label>Prix ($)</label>
                <input
                  className="modal-input"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Catégorie</label>
                <select
                  className="modal-input"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Choisir une catégorie</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button className="btn-primary" onClick={handleSave}>
                {editItem ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmer la suppression</h2>
            </div>

            <div className="modal-body">
              <p>Voulez-vous vraiment supprimer ce produit ?</p>
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>
                Annuler
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}