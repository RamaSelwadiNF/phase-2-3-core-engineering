"use client"

import React, { createContext, useContext, useOptimistic, useTransition } from "react"
import { CartItem, Product } from "@/types"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { addToCartAction } from "@/actions/cart"

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: Product) => Promise<void>
  removeFromCart: (id: string) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [persistedCart, setPersistedCart] = useLocalStorage<CartItem[]>("cart", [])
  const [, startTransition] = useTransition()

  // Here I set up the optimistic state so clicking add reflects instantly on the UI
  const [optimisticCart, setOptimisticCart] = useOptimistic(
    persistedCart,
    (state, action: { type: "ADD" | "REMOVE"; item?: Product; id?: string }) => {
      if (action.type === "ADD" && action.item) {
        const found = state.find((x) => x.id === action.item!.id)
        if (found) {
          return state.map((x) => (x.id === action.item!.id ? { ...x, quantity: x.quantity + 1 } : x))
        }
        return [...state, { id: action.item.id, name: action.item.name, price: action.item.price, quantity: 1 }]
      }
      if (action.type === "REMOVE") {
        return state.filter((x) => x.id !== action.id)
      }
      return state
    }
  )

  const addToCart = async (product: Product) => {
    startTransition(async () => {
      setOptimisticCart({ type: "ADD", item: product })

      try {
        await addToCartAction(product.id)
        // Then update the actual local storage when server confirms it
        setPersistedCart((prev) => {
          const found = prev.find((x) => x.id === product.id)
          if (found) {
            return prev.map((x) => (x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x))
          }
          return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
        })
      } catch (err) {
        // Rollback just naturally happens if we don't save to persistedCart
        alert("Couldn't add item to cart, out of stock.")
      }
    })
  }

  const removeFromCart = (id: string) => {
    startTransition(() => {
      setOptimisticCart({ type: "REMOVE", id })
      setPersistedCart((prev) => prev.filter((item) => item.id !== id))
    })
  }

  return (
    <CartContext.Provider value={{ cart: optimisticCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}