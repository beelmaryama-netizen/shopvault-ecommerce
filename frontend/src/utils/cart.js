const CART_KEY = 'cart'

export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || []
}

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event('cartUpdated'))
}

export const addToCart = (product) => {
  const cart = getCart()
  const existing = cart.find((item) => item.id === product.id)

  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      category: product.category || '',
      quantity: 1
    })
  }

  saveCart(cart)
}

export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id)
  saveCart(cart)
}

export const updateQuantity = (id, quantity) => {
  const cart = getCart().map((item) =>
    item.id === id ? { ...item, quantity: Number(quantity) } : item
  )
  saveCart(cart)
}

export const clearCart = () => {
  saveCart([])
}

export const getCartCount = () => {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + Number(item.quantity), 0)
}