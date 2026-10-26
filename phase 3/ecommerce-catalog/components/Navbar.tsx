"use client"

import { useCart } from "@/context/CartContext"
import { useCartTotals } from "@/hooks/useCartTotals"
import { useEffect, useState } from "react"

export default function Navbar({ onOpenFilters }: { onOpenFilters: () => void }) {
  const { cart } = useCart()
  const { totalItems, totalPrice } = useCartTotals(cart)
  const [dark, setDark] = useState(false)

  // Here I toggle the HTML dark class directly so the whole UI flips instantly
  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle("dark")
    setDark(isDark)
  }

  return (
    <header className="border-b dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-lg tracking-tight">Shop Catalog</h1>
        <button
          onClick={onOpenFilters}
          className="md:hidden text-xs border rounded px-2.5 py-1.5 dark:border-zinc-700"
        >
          Filters
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="border rounded px-2.5 py-1 text-xs dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {dark ? "Light" : "Dark"}
        </button>
        <div className="text-xs border rounded px-3 py-1.5 dark:border-zinc-700">
          Cart: <b>{totalItems}</b> items (${totalPrice.toFixed(2)})
        </div>
      </div>
    </header>
  )
}
