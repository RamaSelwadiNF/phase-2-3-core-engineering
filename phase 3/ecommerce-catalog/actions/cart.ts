"use server"

import { products } from "@/lib/db"
import { revalidateTag } from "next/cache"

export async function addToCartAction(productId: string) {
  const item = products.find((p) => p.id === productId)

  if (!item || item.stockCount <= 0) {
    throw new Error("Item out of stock")
  }

  // Here I decrease the real stock in memory then revalidate the tags so cache stays fresh
  item.stockCount -= 1
  if (item.stockCount === 0) item.inStock = false

  revalidateTag("products", "page")

  return { success: true, item: { id: item.id, name: item.name, price: item.price } }
}