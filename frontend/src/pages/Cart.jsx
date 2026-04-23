import { useEffect, useState } from 'react'
import { getCart, removeFromCart, updateQuantity, clearCart } from '../utils/cart'

export default function Cart() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  const refreshCart = () => {
    setCart(getCart())
  }

  const handleRemove = (id) => {
    removeFromCart(id)
    refreshCart()
  }

  const handleQuantityChange = (id, quantity) => {
    const qte = Number(quantity)

    if (qte < 1 || Number.isNaN(qte)) return

    updateQuantity(id, qte)
    refreshCart()
  }

  const handleClear = () => {
    clearCart()
    refreshCart()
  }

  const totalGeneral = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Panier</h1>
          <p className="page-sub">
            {cart.length} produit{cart.length !== 1 ? 's' : ''} dans le panier
          </p>
        </div>

        {cart.length > 0 && (
          <button className="btn-danger" onClick={handleClear}>
            Vider le panier
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <p>Le panier est vide.</p>
        </div>
      ) : (
        <>
          <div className="cart-table-wrap">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Sous-total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{Number(item.price).toFixed(2)} $</td>
                    <td>
                      <input
                        className="cart-qty-input"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      />
                    </td>
                    <td>{(Number(item.price) * Number(item.quantity)).toFixed(2)} $</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleRemove(item.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-total-box">
            <h3>Total général : {totalGeneral.toFixed(2)} $</h3>
          </div>
        </>
      )}
    </div>
  )
}