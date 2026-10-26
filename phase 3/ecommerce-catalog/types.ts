export type Product = {
  id: string
  name: string
  category: string
  price: number
  rating: number
  inStock: boolean
  stockCount: number
}

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export type FilterParams = {
  query?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  rating?: string
  inStock?: string
}
