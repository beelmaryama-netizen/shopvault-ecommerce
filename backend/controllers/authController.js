const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' })
  }

  const checkSql = 'SELECT * FROM users WHERE email = ?'
  db.query(checkSql, [email], (err, result) => {
    if (err) return res.status(500).json({ message: err.message })

    if (result.length > 0) {
      return res.status(400).json({ message: 'Utilisateur existe déjà' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)'
    db.query(insertSql, [email, hashedPassword], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message })

      res.status(201).json({ message: 'Inscription réussie' })
    })
  })
}

exports.login = (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' })
  }

  const sql = 'SELECT * FROM users WHERE email = ?'
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ message: err.message })

    if (result.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    const user = result[0]

    let valid = false

    if (user.password && user.password.startsWith('$2')) {
      valid = bcrypt.compareSync(password, user.password)
    } else {
      valid = password === user.password
    }

    if (!valid) {
      return res.status(401).json({ message: 'Wrong password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    })
  })
}