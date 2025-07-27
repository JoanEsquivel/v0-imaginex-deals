"use client"

import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useCart } from "@/context/CartContext"
import { Trash2, Plus, Minus } from "lucide-react"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart()

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />

        <main className="max-w-6xl mx-auto py-8 px-4 flex-grow">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

          {items.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
              <Link href="/products" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="card divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4" data-testid="cart-item">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)}</div>

                        {/* Quantity Controls */}
                        <div className="flex items-center" data-testid="quantity-controls">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 border border-gray-300 rounded-l-sm hover:bg-gray-100"
                            aria-label="Decrease quantity"
                            data-testid="decrease-quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-12 text-center border-t border-b border-gray-300 py-1"
                            data-testid="quantity-input"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 border border-gray-300 rounded-r-sm hover:bg-gray-100"
                            aria-label="Increase quantity"
                            data-testid="increase-quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 mt-1 flex items-center text-sm"
                          data-testid="remove-item"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <div className="border-t border-b py-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-lg mb-6" data-testid="cart-total">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>

                  <Link href="/checkout" className="btn-primary w-full block text-center" data-testid="checkout-button">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
