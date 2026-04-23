import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCartCount } from '../utils/cart'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const page = location.pathname
  const [cartCount, setCartCount] = useState(getCartCount())

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount())
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
        <span className="brand-icon">⚡</span>
        <span className="brand-name">ShopVault</span>
      </div>

      <div className="navbar-links">
        <button
          className={`nav-btn ${page === '/products' ? 'active' : ''}`}
          onClick={() => navigate('/products')}
        >
          <span className="nav-icon">📦</span>
          Produits
        </button>

        <button
          className={`nav-btn ${page === '/categories' ? 'active' : ''}`}
          onClick={() => navigate('/categories')}
        >
          <span className="nav-icon">🗂️</span>
          Catégories
        </button>

        <button
          className={`nav-btn ${page === '/cart' ? 'active' : ''}`}
          onClick={() => navigate('/cart')}
        >
          <span className="nav-icon">🛒</span>
          Panier
          <span className="cart-badge">{cartCount}</span>
        </button>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Déconnexion
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </nav>
  )
}