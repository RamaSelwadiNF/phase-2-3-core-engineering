// components/CatalogView.tsx
"use client"

import { useState, Suspense } from "react"
import { Product } from "@/types"
import Navbar from "./Navbar"
import CatalogFilters from "./CatalogFilters"
import ProductCard from "./ProductCard"

export default function CatalogView({ products }: { products: Product[] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar onOpenFilters={() => setIsFilterOpen(true)} />

      <div className="flex flex-1">
        <Suspense fallback={<aside className="hidden md:block w-64 border-r dark:border-zinc-800 p-4 text-xs text-zinc-400">Loading filters...</aside>}>
          <CatalogFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
        </Suspense>

        <main className="flex-1 p-6">
          {products.length === 0 ? (
            <div className="text-center py-20 text-sm text-zinc-500">
              No products found matching those filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}