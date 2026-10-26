import { Suspense } from "react"
import { getProducts } from "@/lib/db"
import { CartProvider } from "@/context/CartContext"
import CatalogView from "@/components/CatalogView"

async function CatalogResults({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const filters = await searchParams
  const products = await getProducts(filters)
  return <CatalogView products={products} />
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  return (
    <CartProvider>
      <Suspense fallback={<div className="p-10 text-center text-sm text-zinc-500">Loading catalog...</div>}>
        <CatalogResults searchParams={searchParams} />
      </Suspense>
    </CartProvider>
  )
}