"use client"

import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) setStoredValue(JSON.parse(item))
    } catch {
      // Just fallback to initial value if localStorage is blocked
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const nextValue = value instanceof Function ? value(storedValue) : value
      setStoredValue(nextValue)
      window.localStorage.setItem(key, JSON.stringify(nextValue))
    } catch {}
  }

  return [storedValue, setValue] as const
}