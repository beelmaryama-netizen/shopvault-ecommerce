import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password
      })

      setSuccess('Inscription réussie ✅')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription')
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-showcase">
          <div className="logo-bolt">⚡</div>
          <h1 className="showcase-title">ShopVault</h1>
          <p className="showcase-sub">
            Créez votre compte et gérez votre boutique facilement.
          </p>

          <div className="showcase-stats">
            <div className="stat-item">
              <strong>Panier</strong>
              <span>intégré</span>
            </div>
            <div className="stat-item">
              <strong>React</strong>
              <span>frontend</span>
            </div>
            <div className="stat-item">
              <strong>Node</strong>
              <span>backend</span>
            </div>
          </div>

          <div className="showcase-list">
            <div className="showcase-chip">📦 Gestion des produits</div>
            <div className="showcase-chip">🗂️ Gestion des catégories</div>
            <div className="showcase-chip">🛒 Calcul du panier</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Inscription</h2>
          <p className="auth-subtitle">Créez votre compte 👋</p>

          {error && <div className="auth-error">⚠️ {error}</div>}
          {success && <div className="auth-error" style={{ color: '#a7f3c5', background: 'rgba(34,197,94,0.14)', borderColor: 'rgba(34,197,94,0.25)' }}>✅ {success}</div>}

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
              S’inscrire
            </button>
          </form>

          <div className="auth-footer">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  )
}