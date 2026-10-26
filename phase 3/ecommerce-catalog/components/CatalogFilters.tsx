"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { useDebounce } from "@/hooks/useDebounce"

export default function CatalogFilters({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get("query") || "")
  const debouncedQuery = useDebounce(query, 300)

  // Here I keep track of what's selected in inputs then push it straight to URL params
  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  useEffect(() => {
    updateParam("query", debouncedQuery || null)
  }, [debouncedQuery])

  const content = (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <label className="block text-xs font-semibold uppercase mb-1">Search</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase mb-1">Category</label>
        <select
          value={searchParams.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value || null)}
          className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="footwear">Footwear</option>
          <option value="apparel">Apparel</option>
          <option value="home">Home</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase mb-1">Max Price</label>
        <input
          type="number"
          placeholder="e.g. 100"
          value={searchParams.get("maxPrice") || ""}
          onChange={(e) => updateParam("maxPrice", e.target.value || null)}
          className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase mb-1">Min Rating</label>
        <select
          value={searchParams.get("rating") || ""}
          onChange={(e) => updateParam("rating", e.target.value || null)}
          className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
        >
          <option value="">Any</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={searchParams.get("inStock") === "true"}
          onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
          className="h-4 w-4"
        />
        In Stock Only
      </label>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 border-r dark:border-zinc-800 h-full">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative ml-auto h-full w-4/5 max-w-xs bg-white dark:bg-zinc-900 shadow-xl flex flex-col">
            <div className="p-4 border-b dark:border-zinc-800 flex justify-between items-center">
              <span className="font-bold">Filters</span>
              <button onClick={onClose} className="p-1">✕</button>
            </div>
            <div className="overflow-y-auto">{content}</div>
          </div>
        </div>
      )}
    </>
  )
}