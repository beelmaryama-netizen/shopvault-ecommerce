import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Products from './pages/Products.jsx'
import Categories from './pages/Categories.jsx'
import Cart from './pages/Cart.jsx'
import Navbar from './components/Navbar.jsx'
import './App.css'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/products"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Products />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Categories />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Cart />
            </>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App