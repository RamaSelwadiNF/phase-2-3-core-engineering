import { CartItem } from "@/types"
import { useMemo } from "react"

export function useCartTotals(items: CartItem[]) {
  return useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return { totalItems, totalPrice }
  }, [items])
}