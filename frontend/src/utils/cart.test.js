import { describe, it, expect, beforeEach } from 'vitest'
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartCount
} from './cart'

describe('Panier', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('ajoute un produit au panier', () => {
    addToCart({ id: 1, name: 'Produit test', price: 100 })

    const cart = getCart()

    expect(cart.length).toBe(1)
    expect(cart[0].id).toBe(1)
    expect(cart[0].name).toBe('Produit test')
    expect(cart[0].price).toBe(100)
    expect(cart[0].quantity).toBe(1)
  })

  it('augmente la quantité si le produit existe déjà', () => {
    addToCart({ id: 1, name: 'Produit test', price: 100 })
    addToCart({ id: 1, name: 'Produit test', price: 100 })

    const cart = getCart()

    expect(cart.length).toBe(1)
    expect(cart[0].quantity).toBe(2)
  })

  it('met à jour la quantité', () => {
    addToCart({ id: 1, name: 'Produit test', price: 100 })
    updateQuantity(1, 4)

    const cart = getCart()

    expect(cart[0].quantity).toBe(4)
  })

  it('supprime un produit', () => {
    addToCart({ id: 1, name: 'Produit A', price: 100 })
    addToCart({ id: 2, name: 'Produit B', price: 200 })

    removeFromCart(1)

    const cart = getCart()

    expect(cart.length).toBe(1)
    expect(cart[0].id).toBe(2)
  })

  it('vide le panier', () => {
    addToCart({ id: 1, name: 'Produit A', price: 100 })
    clearCart()

    expect(getCart()).toEqual([])
  })

  it('calcule le nombre total d’articles', () => {
    addToCart({ id: 1, name: 'Produit A', price: 100 })
    addToCart({ id: 1, name: 'Produit A', price: 100 })
    addToCart({ id: 2, name: 'Produit B', price: 200 })

    expect(getCartCount()).toBe(3)
  })
})