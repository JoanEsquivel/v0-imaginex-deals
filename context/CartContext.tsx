"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product, Order, OrderItem } from "@/types"
import { v4 as uuidv4 } from "uuid"

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  orders: Order[]
  addOrder: (shippingInfo: { name: string; email: string; address: string }) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Load cart and orders from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart from localStorage")
      }
    }

    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (e) {
        console.error("Failed to parse orders from localStorage")
      }
    }
  }, [])

  // Save cart and orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Increment quantity if item already exists
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const addOrder = (shippingInfo: { name: string; email: string; address: string }) => {
    const orderItems: OrderItem[] = items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }))

    const newOrder: Order = {
      id: uuidv4(),
      date: new Date().toISOString(),
      items: orderItems,
      total: getCartTotal(),
      shippingAddress: shippingInfo,
      status: "Processing",
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        orders,
        addOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
