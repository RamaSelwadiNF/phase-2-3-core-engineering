"use client"

import { Product } from "@/types"
import { useCart } from "@/context/CartContext"

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <div className="border rounded-lg p-4 flex flex-col justify-between dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-base">{product.name}</h3>
          <span className="text-xs font-bold text-amber-500">★ {product.rating}</span>
        </div>
        <p className="text-xs text-zinc-500 uppercase mt-1">{product.category}</p>
        <p className="text-lg font-bold mt-3">${product.price}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs ${product.stockCount > 0 ? "text-emerald-600" : "text-rose-500"}`}>
          {product.stockCount > 0 ? `${product.stockCount} in stock` : "Out of stock"}
        </span>
        <button
          onClick={() => addToCart(product)}
          disabled={!product.inStock || product.stockCount <= 0}
          className="bg-black text-white dark:bg-white dark:text-black text-xs font-semibold px-3 py-2 rounded hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}