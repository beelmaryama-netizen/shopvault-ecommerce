import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-showcase">
          <div className="logo-bolt">⚡</div>
          <h1 className="showcase-title">ShopVault</h1>
          <p className="showcase-sub">
            Gérez vos produits et catégories avec style.
          </p>

          <div className="showcase-stats">
            <div className="stat-item">
              <strong>10+</strong>
              <span>Produits</span>
            </div>
            <div className="stat-item">
              <strong>2</strong>
              <span>Catégories</span>
            </div>
            <div className="stat-item">
              <strong>100%</strong>
              <span>Sécurisé</span>
            </div>
          </div>

          <div className="showcase-list">
            <div className="showcase-chip">📱 iPhone 13 — 999$</div>
            <div className="showcase-chip">💻 Dell XPS — 1200$</div>
            <div className="showcase-chip">🖥️ Samsung 24" — 250$</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Connexion</h2>
          <p className="auth-subtitle">Content de vous revoir 👋</p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Adresse e-mail</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁️
                </button>
              </div>
            </div>

            <button className="auth-btn" type="submit">
              Se connecter
            </button>
          </form>

          <div className="auth-footer">
            Pas encore de compte ? <Link to="/register">S’inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  )
}