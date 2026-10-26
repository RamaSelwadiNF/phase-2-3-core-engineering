import { Product } from "@/types"

// Here I set up dummy data so everything works right out of the box
export let products: Product[] = [
  { id: "1", name: "Mechanical Keyboard", category: "electronics", price: 120, rating: 5, inStock: true, stockCount: 8 },
  { id: "2", name: "Wireless Mouse", category: "electronics", price: 45, rating: 4, inStock: true, stockCount: 14 },
  { id: "3", name: "Running Shoes", category: "footwear", price: 95, rating: 4, inStock: false, stockCount: 0 },
  { id: "4", name: "Heavyweight Hoodie", category: "apparel", price: 65, rating: 5, inStock: true, stockCount: 5 },
  { id: "5", name: "Ceramic Coffee Mug", category: "home", price: 18, rating: 3, inStock: true, stockCount: 20 },
]

export async function getProducts(filters: Record<string, string | undefined>): Promise<Product[]> {
  return products.filter((p) => {
    if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase())) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false
    if (filters.rating && p.rating < Number(filters.rating)) return false
    if (filters.inStock === "true" && !p.inStock) return false
    return true
  })
}